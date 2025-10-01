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
      strict: false,
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

// Function to check if a code block is inside a comment
function isCodeBlockInComment(content, blockStart) {
  // Check if the block is within a multi-line comment
  const multiLineCommentRegex = /\/\*[\s\S]*?\*\//g;
  let match;
  while ((match = multiLineCommentRegex.exec(content)) !== null) {
    const commentStart = match.index;
    const commentEnd = commentStart + match[0].length;

    // If the code block starts within a comment, it should be ignored
    if (blockStart >= commentStart && blockStart < commentEnd) {
      return true;
    }
  }

  // Check if the block is within a single-line comment
  const lines = content.split('\n');
  let currentPos = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineLength = line.length + 1; // +1 for the newline character
    const lineStart = currentPos;
    const lineEnd = currentPos + lineLength;

    // If the block starts on this line
    if (blockStart >= lineStart && blockStart < lineEnd) {
      // Check if there's a single-line comment on this line before the block start
      const commentIndex = line.indexOf('//');
      if (commentIndex !== -1 && lineStart + commentIndex < blockStart) {
        return true;
      }
    }

    currentPos += lineLength;
  }

  return false;
}

// Function to process and add errors to the file errors map
function addErrorsToMap(file, typeErrors, fileErrorsMap, markdownLineNumber) {
  // Filter and process errors
  const processedErrors = typeErrors
    .map((error) => {
      if (error.includes('Expression expected') || error.includes('Cannot find module')) {
        return null;
      }
      return {
        error: error.trim(),
        markdownLineNumber,
      };
    })
    .filter(Boolean);

  // If we have errors to add after filtering
  if (processedErrors.length > 0) {
    // Initialize the array if this is the first time we're seeing this file
    if (!fileErrorsMap[file]) {
      fileErrorsMap[file] = [];
    }

    // Add all errors for this code block to the file's error array
    fileErrorsMap[file].push(...processedErrors);
  }
}

// Object to store errors by file path
const fileErrorsMap = {};

for (const file of filesToLint) {
  console.log(file);
  const fileContent = fs.readFileSync(file, 'utf8');

  // Find all code blocks and filter out those in comments
  const validCodeBlocks = [];
  let match;

  // Reset regex lastIndex to ensure we start from the beginning
  codeBlockRegex.lastIndex = 0;

  while ((match = codeBlockRegex.exec(fileContent)) !== null) {
    const blockStart = match.index;

    // Only include code blocks that are not within comments
    if (!isCodeBlockInComment(fileContent, blockStart)) {
      // Calculate the line number where the code block starts
      const textBeforeBlock = fileContent.substring(0, blockStart);
      const lineNumber = textBeforeBlock.split('\n').length;

      validCodeBlocks.push({
        lang: match[1], // 'tsx' or 'jsx'
        code: match[2].trim(), // the actual code
        markdownLineNumber: lineNumber, // line number in the original markdown file
      });
    }
  }

  for (const codeBlock of validCodeBlocks) {
    const { typeErrors } = getTypeErrors(codeBlock.code);
    if (typeErrors.length > 0) {
      addErrorsToMap(file, typeErrors, fileErrorsMap, codeBlock.markdownLineNumber);
    }
  }
}

// Convert the map to the final errors array format
for (const [file, fileErrors] of Object.entries(fileErrorsMap)) {
  errors.push({
    file,
    errors: fileErrors,
  });
}

// write to fs
fs.writeFileSync('./knowledgebase-ts-errors.json', JSON.stringify(errors, null, 2), 'utf-8');

if (errors.length > 0) {
  console.log('--------------------------------');

  console.log(`❌ ${errors.length} Files have errors in knowledgebase\n\n`);
  console.log(JSON.stringify(errors, null, 2));

  console.log('--------------------------------');

  process.exit(1);
} else {
  console.log('--------------------------------');
  console.log('✅ No errors found in knowledgebase');
  console.log('--------------------------------');

  process.exit(0);
}
