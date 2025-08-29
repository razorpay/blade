import fs from 'fs';
import path from 'path';

const outputRootDirectory = 'build';
const typesDirectory = 'types';
const generatedTypesRoot = `${outputRootDirectory}/generated-types`;

const exportCategories = ['components', 'tokens', 'utils'];

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function copyIfExists(from, to) {
  if (fs.existsSync(from)) {
    ensureDir(path.dirname(to));
    fs.copyFileSync(from, to);
  }
}

function bundlePlatform(platform) {
  exportCategories.forEach((exportCategory) => {
    const src = path.resolve(generatedTypesRoot, platform, exportCategory, 'index.d.ts');
    const isNative = platform === 'native';
    const dest = path.resolve(
      outputRootDirectory,
      typesDirectory,
      exportCategory,
      isNative ? 'index.native.d.ts' : 'index.d.ts',
    );
    copyIfExists(src, dest);
  });
}

bundlePlatform('web');
bundlePlatform('native');

console.log('Bundled declaration files to build/types');



