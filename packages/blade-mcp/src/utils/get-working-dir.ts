import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Go one level up from `dist` directory to get the root directory
const workingDirectory = resolve(__dirname, '..', '..');

export { workingDirectory };
