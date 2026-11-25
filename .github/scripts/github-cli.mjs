import { execFileSync } from "node:child_process";

const MAX_BUFFER_BYTES = 10 * 1024 * 1024;
const COMMENT_PROJECTION = '.[] | {user: {login: .user.login}, body: (.body // "")}';

function parseJsonLines(output) {
  return output
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function runGh(args, { format = "json", execFile = execFileSync } = {}) {
  const output = execFile("gh", args, {
    encoding: "utf8",
    maxBuffer: MAX_BUFFER_BYTES,
    stdio: ["pipe", "pipe", "pipe"],
  });

  if (!output.trim()) return [];
  return format === "json-lines" ? parseJsonLines(output) : JSON.parse(output);
}

function fetchComments({ repo, prNumber, type }, options) {
  const endpoint =
    type === "review"
      ? `repos/${repo}/pulls/${prNumber}/comments`
      : `repos/${repo}/issues/${prNumber}/comments`;

  return runGh(
    ["api", endpoint, "--paginate", "--jq", COMMENT_PROJECTION],
    { ...options, format: "json-lines" },
  );
}

export { COMMENT_PROJECTION, MAX_BUFFER_BYTES, fetchComments, parseJsonLines, runGh };
