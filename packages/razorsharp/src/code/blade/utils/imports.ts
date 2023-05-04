import { BLADE_IMPORT_PATH } from '../constants/paths';
import type { Imports } from '~/code/types/TransformFunction';

export const generateImportsCode = (imports: Imports): string => {
  let code = '';
  for (const [importPath, importNames] of Object.entries(imports)) {
    code += `import { ${Array.from(new Set(importNames.filter((i) => !!i))).join(
      ', ',
    )} } from "${importPath}";`;
  }

  return code;
};

export const bladeImports = (imports: string[]): Record<string, string[]> => ({
  [BLADE_IMPORT_PATH]: imports.filter((i) => !!i),
});

// function that merges two objects of type Imports and returns a new object
export const mergeImports = (imports_one: Imports, imports_two: Imports): Imports => {
  const mergedImports: Imports = {};

  for (const [importPath, importNames] of Object.entries(imports_one)) {
    if (importPath in imports_two) {
      mergedImports[importPath] = [...new Set([...importNames, ...imports_two[importPath]])];
    } else {
      mergedImports[importPath] = importNames;
    }
  }

  for (const [importPath, importNames] of Object.entries(imports_two)) {
    if (!(importPath in imports_one)) {
      mergedImports[importPath] = importNames;
    }
  }

  return mergedImports;
};
