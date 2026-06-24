#!/usr/bin/env node
/**
 * Pushes agentic blade metrics to the blade wiki.
 *
 * Usage:
 *   node push-agentic-metrics-wiki.mjs <markdown-file>
 *
 *   The markdown file content replaces the agentic-blade-metrics wiki page.
 */

import { execSync } from "child_process";
import { readFileSync, writeFileSync, rmSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";

const WIKI_REPO = "https://github.com/razorpay/blade.wiki.git";
const WIKI_PAGE = "agentic-blade-metrics.md";

const markdownFile = process.argv[2];
if (!markdownFile) {
  console.error("Usage: node push-agentic-metrics-wiki.mjs <markdown-file>");
  process.exit(1);
}

const content = readFileSync(markdownFile, "utf8");

const wikiDir = join(tmpdir(), `blade-wiki-${Date.now()}`);

try {
  execSync(`git clone ${WIKI_REPO} ${wikiDir}`, { stdio: "inherit" });

  writeFileSync(join(wikiDir, WIKI_PAGE), content);

  execSync("git add .", { cwd: wikiDir, stdio: "inherit" });
  execSync(`git commit -m "chore: update agentic blade metrics [skip ci]"`, {
    cwd: wikiDir,
    stdio: "inherit",
  });
  execSync("git push", { cwd: wikiDir, stdio: "inherit" });

  console.log(`Wiki page '${WIKI_PAGE}' updated successfully.`);
} finally {
  rmSync(wikiDir, { recursive: true, force: true });
}
