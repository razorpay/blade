/**
 * Finds drift between Blade component prop types (source of truth) and the
 * TypeScript types written in blade-mcp knowledgebase docs.
 *
 * For every `packages/blade-mcp/knowledgebase/components/{Name}.md` it compares
 * `{Name}Props` from the doc with `{Name}Props` exported by `packages/blade/src/components`:
 * - props that exist in code but are missing in the doc
 * - props that exist in the doc but not in code
 * - literal union values (e.g. `size`) that differ between doc and code.
 *   A code value is not reported when the doc type accepts it, so short types like
 *   `string` or `spacing.${number}` can stand in for large token unions.
 * It also lists exported components that have no knowledgebase doc.
 *
 * Known exceptions (internal props, docs that can't be compared) live in
 * `scripts/knowledgebaseDriftIgnore.json`. Every entry needs a reason.
 *
 * Usage:
 *   yarn check:knowledgebase-drift                  # all components
 *   yarn check:knowledgebase-drift TextInput Button  # selected components
 *   yarn check:knowledgebase-drift --fail            # exit 1 when drift is found
 */
const fs = require('fs');
const path = require('path');
const { Project, ts } = require('ts-morph');

const rootDir = path.join(__dirname, '..');
const bladeDir = path.join(rootDir, 'packages/blade');
const componentsDocsDir = path.join(rootDir, 'packages/blade-mcp/knowledgebase/components');
const reportPath = path.join(rootDir, 'knowledgebase-drift-report.json');
const ignoreConfig = require('./knowledgebaseDriftIgnore.json');

const args = process.argv.slice(2);
const shouldFail = args.includes('--fail');
const selectedComponents = args.filter((arg) => !arg.startsWith('--'));

// Props that come from shared helper types. Docs reference these types by name
// (StyledPropsBlade, DataAnalyticsAttribute, TestID) instead of listing every prop.
const SHARED_PROP_TYPES = ['StyledPropsBlade', 'DataAnalyticsAttribute', 'TestID'];

const project = new Project({
  tsConfigFilePath: path.join(bladeDir, 'tsconfig.json'),
  skipAddingFilesFromTsConfig: true,
});
const checker = project.getTypeChecker().compilerObject;

/**
 * @param {import('ts-morph').Type} type
 * @returns {import('ts-morph').Type[]}
 */
const getUnionMembers = (type) => (type.isUnion() ? type.getUnionTypes() : [type]);

/**
 * @typedef {{ types: import('ts-morph').Type[], literals: Map<string, import('ts-morph').Type> }} PropInfo
 */

/**
 * Collects props across all union members, so discriminated prop unions
 * (e.g. WithLabel | WithA11yLabel) report every possible prop.
 * @param {import('ts-morph').Type} type
 * @param {import('ts-morph').Node} node
 * @returns {Map<string, PropInfo | null>} `null` marks an unresolved prop type (any / unknown)
 */
const getPropsMap = (type, node) => {
  const propsMap = new Map();
  for (const member of getUnionMembers(type)) {
    for (const symbol of member.getProperties()) {
      const name = symbol.getName();
      const propType = symbol.getTypeAtLocation(node);
      if (propType.isAny() || propType.isUnknown()) {
        if (!propsMap.has(name)) propsMap.set(name, null);
        continue;
      }
      const info = propsMap.get(name) ?? { types: [], literals: new Map() };
      info.types.push(propType);
      for (const propTypeMember of getUnionMembers(propType)) {
        if (propTypeMember.isLiteral() || propTypeMember.isBooleanLiteral()) {
          info.literals.set(propTypeMember.getText(), propTypeMember);
        }
      }
      propsMap.set(name, info);
    }
  }
  return propsMap;
};

/**
 * @param {import('ts-morph').Type} literal
 * @param {PropInfo} info
 */
const isAcceptedBy = (literal, info) =>
  info.types.some((type) => checker.isTypeAssignableTo(literal.compilerType, type.compilerType));

/**
 * @param {string} fileName
 * @param {string} source
 */
const resolveType = (fileName, source) => {
  const sourceFile = project.createSourceFile(fileName, source, { overwrite: true });
  const alias = sourceFile.getTypeAlias('__Resolved');
  if (!alias) {
    project.removeSourceFile(sourceFile);
    throw new Error('Types have syntax errors');
  }
  return { type: alias.getType(), node: alias, sourceFile };
};

// ---- code side ----
const codeEntryPath = path.join(bladeDir, 'src/__knowledgebaseDrift__.ts');
const codeEntry = project.createSourceFile(
  codeEntryPath,
  `import type { StyledPropsBlade } from './components/Box/styledProps';
import type { DataAnalyticsAttribute, TestID } from './utils/types';
export type __Shared = StyledPropsBlade & DataAnalyticsAttribute & TestID;`,
  { overwrite: true },
);
const bladeModule = project
  .addSourceFileAtPath(path.join(bladeDir, 'src/components/index.ts'))
  .getExportedDeclarations();
const sharedAlias = codeEntry.getTypeAliasOrThrow('__Shared');
const sharedPropNames = new Set(sharedAlias.getType().getProperties().map((s) => s.getName()));

/**
 * Shared helper props, React-only props (ref, key), internal props (`_` prefix)
 * and props listed in the ignore config are not expected in docs.
 * @param {string} component
 * @param {string} prop
 */
const isIgnoredProp = (component, prop) =>
  sharedPropNames.has(prop) ||
  prop === 'ref' ||
  prop === 'key' ||
  prop.startsWith('_') ||
  Boolean(ignoreConfig.components[component]?.ignoreProps?.includes(prop));

/**
 * Values from the ignore config (global CSS keywords, per-component exceptions).
 * @param {string} component
 * @param {string} prop
 * @param {string} value literal text, e.g. `"inherit"`
 */
const isIgnoredValue = (component, prop, value) => {
  const bareValue = value.replace(/^"(.*)"$/, '$1');
  const { ignore, ignorePrefixes } = ignoreConfig.values;
  return (
    ignore.includes(bareValue) ||
    ignorePrefixes.some((prefix) => bareValue.startsWith(prefix)) ||
    Boolean(ignoreConfig.components[component]?.ignoreValues?.[prop]?.includes(bareValue))
  );
};

/**
 * @param {string} name
 * @returns {Map<string, PropInfo | null> | null}
 */
const getCodeProps = (name) => {
  // Prefer the exported `{Name}Props` type. Fall back to the component's props
  // when only the component is exported.
  let source;
  if (bladeModule.has(`${name}Props`)) {
    source = `import type { ${name}Props } from './components';
export type __Resolved = ${name}Props;`;
  } else if (bladeModule.has(name)) {
    source = `import type React from 'react';
import type { ${name} } from './components';
export type __Resolved = React.ComponentProps<typeof ${name}>;`;
  } else {
    return null;
  }
  const { type, node } = resolveType(codeEntryPath, source);
  return getPropsMap(type, node);
};

// ---- doc side ----
// Matches fences of 3 or more backticks. The closing fence must use the same
// number of backticks, so ``` examples nested inside a ```` block are kept.
const typesBlockRegex = /^(`{3,})(?:typescript|ts|tsx)[^\n]*\n([\s\S]*?)^\1`*[ \t]*$/gm;

/**
 * @param {string} markdown
 * @returns {string | null}
 */
const getTypesSection = (markdown) => {
  const lines = markdown.split('\n');
  const start = lines.findIndex((line) => /^##\s+typescript types\s*$/i.test(line));
  if (start === -1) return null;
  // The section ends at the next `## ` heading that is not inside a code fence
  let fence = null;
  for (let i = start + 1; i < lines.length; i++) {
    const fenceMatch = /^(`{3,})/.exec(lines[i]);
    if (fenceMatch) {
      if (!fence) fence = fenceMatch[1];
      else if (fenceMatch[1].length >= fence.length) fence = null;
    }
    if (!fence && /^## /.test(lines[i])) return lines.slice(start + 1, i).join('\n');
  }
  return lines.slice(start + 1).join('\n');
};

/**
 * @param {string} name
 * @param {string} markdown
 * @returns {{ props: Map<string, PropInfo | null> | null, unresolvedTypes?: string[], reason?: string }}
 */
const getDocProps = (name, markdown) => {
  const typesSection = getTypesSection(markdown);
  if (typesSection === null) return { props: null, reason: 'No "## TypeScript Types" section' };
  const blocks = [...typesSection.matchAll(typesBlockRegex)];
  if (blocks.length === 0) return { props: null, reason: 'No typescript code block' };
  const docTypes = blocks.map((block) => block[2]).join('\n');
  if (!new RegExp(`\\b(type|interface)\\s+${name}Props\\b`).test(docTypes)) {
    return { props: null, reason: `No "${name}Props" type in doc` };
  }

  const docFilePath = path.join(bladeDir, `src/__knowledgebaseDrift__${name}.tsx`);
  // Docs use helper types without importing them. Stub unknown names as empty
  // types so the doc's own props still resolve.
  const stubs = new Set(SHARED_PROP_TYPES);
  let resolved;
  for (let attempt = 0; attempt < 5; attempt++) {
    const stubSource = [...stubs]
      .filter((stub) => !new RegExp(`\\b(type|interface)\\s+${stub}\\b`).test(docTypes))
      .map((stub) => `type ${stub}<_A = any, _B = any, _C = any> = {};`)
      .join('\n');
    if (resolved) project.removeSourceFile(resolved.sourceFile);
    resolved = resolveType(
      docFilePath,
      `import type React from 'react';
${stubSource}
${docTypes}
export type __Resolved = ${name}Props;`,
    );
    const missingNames = resolved.sourceFile
      .getPreEmitDiagnostics()
      .map((d) => ts.flattenDiagnosticMessageText(d.compilerObject.messageText, '\n'))
      .map((message) => /Cannot find name '(\w+)'/.exec(message)?.[1])
      .filter((missing) => missing && !stubs.has(missing));
    if (missingNames.length === 0) break;
    missingNames.forEach((missing) => stubs.add(missing));
  }
  const props = getPropsMap(resolved.type, resolved.node);
  const unresolvedTypes = [...stubs].filter((stub) => !SHARED_PROP_TYPES.includes(stub));
  // The caller compares prop types, then removes the source file with `cleanup`
  const { sourceFile } = resolved;
  return { props, unresolvedTypes, cleanup: () => project.removeSourceFile(sourceFile) };
};

/**
 * @param {string} name
 * @returns {ReturnType<typeof getDocProps>}
 */
const readDocProps = (name) => {
  const markdown = fs.readFileSync(path.join(componentsDocsDir, `${name}.md`), 'utf8');
  try {
    return getDocProps(name, markdown);
  } catch (error) {
    return { props: null, reason: `Could not parse doc types: ${error.message}` };
  }
};

// ---- compare ----
const docFiles = fs
  .readdirSync(componentsDocsDir)
  .filter((file) => file.endsWith('.md'))
  .map((file) => file.replace(/\.md$/, ''))
  .filter((name) => selectedComponents.length === 0 || selectedComponents.includes(name));

const report = { drift: [], skipped: [], missingDocs: [], ignoredSkipped: [] };

for (const name of docFiles) {
  const codeProps = getCodeProps(name);
  const { props: docProps, unresolvedTypes, reason, cleanup } = codeProps
    ? readDocProps(name)
    : { props: null, reason: `No "${name}" export in blade` };
  if (!codeProps || !docProps) {
    const ignoreReason = ignoreConfig.skippedDocs[name];
    if (ignoreReason) report.ignoredSkipped.push({ component: name, reason: ignoreReason });
    else report.skipped.push({ component: name, reason });
    continue;
  }

  // Props documented in another doc (e.g. Stagger -> Box) count as documented.
  // Only their names are used, so their values are not compared.
  const inheritedPropNames = new Set();
  for (const inheritedDoc of ignoreConfig.components[name]?.inheritDocProps ?? []) {
    const inherited = readDocProps(inheritedDoc);
    for (const prop of inherited.props?.keys() ?? []) inheritedPropNames.add(prop);
    inherited.cleanup?.();
  }

  const missingInDoc = [...codeProps.keys()].filter(
    (prop) => !docProps.has(prop) && !inheritedPropNames.has(prop) && !isIgnoredProp(name, prop),
  );
  const notInCode = [...docProps.keys()].filter(
    (prop) => !codeProps.has(prop) && !isIgnoredProp(name, prop),
  );
  const valueMismatches = [];
  for (const [prop, codeInfo] of codeProps) {
    const docInfo = docProps.get(prop);
    if (isIgnoredProp(name, prop) || !docInfo || !codeInfo) continue;
    const getValueDiff = (fromInfo, toInfo) =>
      [...fromInfo.literals]
        .filter(([value]) => !toInfo.literals.has(value) && !isIgnoredValue(name, prop, value))
        .filter(([, literal]) => !isAcceptedBy(literal, toInfo))
        .map(([value]) => value);
    const missingValues = getValueDiff(codeInfo, docInfo);
    const extraValues = getValueDiff(docInfo, codeInfo);
    if (missingValues.length || extraValues.length) {
      valueMismatches.push({ prop, missingInDoc: missingValues, notInCode: extraValues });
    }
  }
  cleanup();

  if (missingInDoc.length || notInCode.length || valueMismatches.length || unresolvedTypes.length) {
    report.drift.push({ component: name, missingInDoc, notInCode, valueMismatches, unresolvedTypes });
  }
}

if (selectedComponents.length === 0) {
  // Sub-components (e.g. ModalBody) are documented inside their parent's doc,
  // so a component counts as documented when any doc mentions it.
  const allDocsContent = docFiles
    .map((name) => fs.readFileSync(path.join(componentsDocsDir, `${name}.md`), 'utf8'))
    .join('\n');
  report.missingDocs = [...bladeModule.keys()]
    .filter((exportName) => /^[A-Z]/.test(exportName) && bladeModule.has(`${exportName}Props`))
    .filter((exportName) => !exportName.startsWith('Base') && !ignoreConfig.missingDocs[exportName])
    .filter((exportName) => !new RegExp(`\\b${exportName}\\b`).test(allDocsContent))
    .sort();
}

fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');

// ---- print ----
for (const { component, missingInDoc, notInCode, valueMismatches, unresolvedTypes } of report.drift) {
  console.log(`\n❌ ${component}`);
  if (unresolvedTypes.length) {
    console.log(`  Types used in doc but not defined: ${unresolvedTypes.join(', ')}`);
  }
  if (missingInDoc.length) console.log(`  Props missing in doc: ${missingInDoc.join(', ')}`);
  if (notInCode.length) console.log(`  Props in doc but not in code: ${notInCode.join(', ')}`);
  for (const mismatch of valueMismatches) {
    const parts = [];
    if (mismatch.missingInDoc.length) parts.push(`missing in doc: ${mismatch.missingInDoc.join(' | ')}`);
    if (mismatch.notInCode.length) parts.push(`not in code: ${mismatch.notInCode.join(' | ')}`);
    console.log(`  ${mismatch.prop} values — ${parts.join('; ')}`);
  }
}
if (report.skipped.length) {
  console.log('\n⚠️  Skipped (not in ignore config):');
  report.skipped.forEach(({ component, reason }) => console.log(`  ${component}: ${reason}`));
}
if (report.missingDocs.length) {
  console.log(`\n📄 Components without knowledgebase doc: ${report.missingDocs.join(', ')}`);
}
console.log(
  `\n${report.drift.length} of ${docFiles.length} docs have drift. Full report: ${path.relative(
    rootDir,
    reportPath,
  )}`,
);

const hasProblems = report.drift.length || report.skipped.length || report.missingDocs.length;
process.exit(shouldFail && hasProblems ? 1 : 0);
