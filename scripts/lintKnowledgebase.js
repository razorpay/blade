/* eslint-disable no-control-regex */
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const { Project, ts } = require('ts-morph');

const knowledgebasePath = path.join(__dirname, '../packages/blade-mcp/knowledgebase');
const files = glob.sync(`${knowledgebasePath}/**/*.md`);

const filesToLint = files.filter((file) => file.endsWith('.md'));

/**
 * @param {string} str
 * @returns {string}
 */
const stripColor = (str) => str.replace(/\x1B[[(?);]{0,2}(;?\d)*./g, '');

/**
 * @param {string} sourceCode
 */
function getTypeErrors(sourceCode) {
  const project = new Project({
    // libFolderPath: '../node_modules/typescript/lib',
    compilerOptions: {
      moduleSuffixes: ['.web', ''],
      skipLibCheck: true,
      isolatedModules: true,
      jsx: ts.JsxEmit.ReactJSX,
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      noEmit: true,
    },
  });

  project.createSourceFile('index.tsx', sourceCode);

  const diagnostics = project.getPreEmitDiagnostics();

  return {
    typeErrors: diagnostics.map((d) =>
      stripColor(project.formatDiagnosticsWithColorAndContext([d])).trim(),
    ),
  };
}

const errors = [];
// this might be slow but better than pulling in a markdown parser
const codeBlockRegex = /```(tsx|jsx)\s*([\s\S]*?)```/g;

for (const file of filesToLint) {
  console.log(file);
  const fileContent = fs.readFileSync(file, 'utf8');
  const codeBlocks = [...fileContent.matchAll(codeBlockRegex)].map((match) => ({
    lang: match[1], // 'tsx' or 'jsx'
    code: match[2].trim(), // the actual code
  }));

  for (const codeBlock of codeBlocks) {
    const { typeErrors } = getTypeErrors(codeBlock.code);
    if (typeErrors.length > 0) {
      errors.push({
        file,
        errors: typeErrors
          .map((error) => {
            if (error.includes('Expression expected') || error.includes('Cannot find module')) {
              return null;
            }
            return error.trim();
          })
          .filter(Boolean),
      });
    }
  }
}

// write to fs
fs.writeFileSync('./knowledgebase-ts-errors.json', JSON.stringify(errors, null, 2), 'utf-8');
// console.log(errors);
