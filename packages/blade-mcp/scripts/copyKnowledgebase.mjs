/**
 * Knowledgebase docs are authored in packages/blade-plugin/skills/blade/references
 * and copied here at build/test time so the MCP tools and the published tarball
 * keep reading `knowledgebase/`. Only the docs are shared: the MCP keeps its own
 * skillTemplate, SKILL_VERSION and analytics so plugin changes cannot alter MCP
 * behaviour. packages/blade-mcp/knowledgebase is gitignored; never edit files there.
 */
import { cpSync, rmSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, '..');
const source = join(packageRoot, '..', 'blade-plugin', 'skills', 'blade', 'references');
const destination = join(packageRoot, 'knowledgebase');

if (!existsSync(join(source, 'components'))) {
  console.error(`[copyKnowledgebase] blade skill references not found at ${source}`);
  process.exit(1);
}

rmSync(destination, { recursive: true, force: true });
cpSync(source, destination, { recursive: true });

console.log(`[copyKnowledgebase] copied blade skill references -> ${destination}`);
