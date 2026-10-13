import assert from "node:assert/strict";
import test from "node:test";
import {
  COMMENT_PROJECTION,
  MAX_BUFFER_BYTES,
  fetchComments,
  parseJsonLines,
  runGh,
} from "./github-cli.mjs";

test("parseJsonLines parses paginated gh output", () => {
  const output = [
    JSON.stringify({ user: { login: "reviewer" }, body: "First" }),
    JSON.stringify({ user: { login: "author" }, body: "Second\nline" }),
    "",
  ].join("\n");

  assert.deepEqual(parseJsonLines(output), [
    { user: { login: "reviewer" }, body: "First" },
    { user: { login: "author" }, body: "Second\nline" },
  ]);
});

test("runGh executes gh without a shell and raises the output buffer", () => {
  const calls = [];
  const result = runGh(["pr", "list", "--json", "number"], {
    execFile: (file, args, options) => {
      calls.push({ file, args, options });
      return '[{"number":1}]';
    },
  });

  assert.deepEqual(result, [{ number: 1 }]);
  assert.equal(calls[0].file, "gh");
  assert.deepEqual(calls[0].args, ["pr", "list", "--json", "number"]);
  assert.equal(calls[0].options.maxBuffer, MAX_BUFFER_BYTES);
});

test("fetchComments requests only the fields used by the metrics report", () => {
  const calls = [];
  const comments = fetchComments(
    { repo: "razorpay/blade", prNumber: 3733, type: "review" },
    {
      execFile: (file, args) => {
        calls.push({ file, args });
        return '{"user":{"login":"rzp-slash-public[bot]"},"body":"Review"}\n';
      },
    },
  );

  assert.deepEqual(comments, [
    { user: { login: "rzp-slash-public[bot]" }, body: "Review" },
  ]);
  assert.deepEqual(calls[0], {
    file: "gh",
    args: [
      "api",
      "repos/razorpay/blade/pulls/3733/comments",
      "--paginate",
      "--jq",
      COMMENT_PROJECTION,
    ],
  });
  assert.equal(COMMENT_PROJECTION.includes("diff_hunk"), false);
});

test("fetchComments supports issue comments", () => {
  const calls = [];
  fetchComments(
    { repo: "razorpay/blade", prNumber: 42, type: "issue" },
    {
      execFile: (file, args) => {
        calls.push({ file, args });
        return "";
      },
    },
  );

  assert.equal(calls[0].args[1], "repos/razorpay/blade/issues/42/comments");
});
