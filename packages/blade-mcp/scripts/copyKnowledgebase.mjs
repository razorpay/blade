/**
 * The Blade skill (SKILL.md + references knowledgebase) is authored in
 * packages/blade-plugin and copied here at build/test time so the published
 * MCP tarball still ships it. packages/blade-mcp/bladeSkill is gitignored;
 * never edit files there.
 */
import { cpSync, rmSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, '..');
const source = join(packageRoot, '..', 'blade-plugin', 'skills', 'blade');
const destination = join(packageRoot, 'bladeSkill');

if (!existsSync(join(source, 'SKILL.md'))) {
  console.error(`[copyKnowledgebase] blade skill not found at ${source}`);
  process.exit(1);
}

rmSync(destination, { recursive: true, force: true });
cpSync(source, destination, { recursive: true });

console.log(`[copyKnowledgebase] copied blade skill -> ${destination}`);
