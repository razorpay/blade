---
name: pr-sanity-critique
description: Reviews PR sanity — CI status, changeset, docs, and tests. Spawned by code-review skill.
color: yellow
---

# PR Sanity Critique

You are a subagent. Return the JSON output. No commentary.

## Inputs (passed in prompt)

- `PR_NUMBER`: the PR number in razorpay/blade

## Steps

### 1. Fetch CI checks

```bash
gh pr checks {PR_NUMBER} --repo razorpay/blade --json name,description,link,state,startedAt,completedAt,workflow
```

For any failing checks, get details:

```bash
gh run view --job {JOB_ID} --repo razorpay/blade
```

### 2. Check for changeset coverage

```bash
node -e "
const { execSync } = require('child_process');
const PR = '{PR_NUMBER}';
const REPO_ROOT = execSync('git rev-parse --show-toplevel', {encoding:'utf8'}).trim();

const rootPkg = require(REPO_ROOT + '/package.json');
const workspaces = rootPkg.workspaces.packages;

const files = JSON.parse(execSync('gh pr view ' + PR + ' --repo razorpay/blade --json files --jq \".files\"', {encoding:'utf8'}));
const changedPaths = files.map(f => f.path);

const touchedPackages = workspaces.filter(pkg => changedPaths.some(p => p.startsWith(pkg + '/')));

let bumpedPackages = {};
const changesetFiles = changedPaths.filter(p => p.startsWith('.changeset/') && p.endsWith('.md'));
if (changesetFiles.length) {
  const patches = JSON.parse(execSync('gh api repos/razorpay/blade/pulls/' + PR + '/files --jq \'[.[] | select(.filename | startswith(\".changeset/\")) | {file:.filename,patch:.patch}]\'', {encoding:'utf8'}));
  patches.forEach(({patch}) => {
    for (const [, name, bump] of (patch?.matchAll(/^\+\"(@[^\"]+)\":\s*(patch|minor|major)/gm) ?? []))
      bumpedPackages[name] = bump;
  });
}

const issues = [];
for (const pkg of touchedPackages) {
  const name = require(REPO_ROOT + '/' + pkg + '/package.json').name;
  if (!bumpedPackages[name])
    issues.push('Missing changeset bump for ' + name + ' (' + pkg + ' was modified)');
}

console.log(JSON.stringify({touched_packages: touchedPackages, bumped_packages: bumpedPackages, issues}, null, 2));
"
```

Add any `issues` from the output to `issues` as entries with only a `problem` field (no `file`/`line`/`side`/`severity`).

## Output

```json
{
  "pr_number": 1234,
  "critique_name": "pr-sanity-critique",
  "statuses": [
    {
      "name": "Check 1 name",
      "description": "Description field from gh pr checks output",
      "state": "SUCCESS",
      "link": "https://github.com/razorpay/blade/actions/runs/1234567890"
    },
    {
      "name": "Check 2 name",
      "description": "Description field from gh pr checks output",
      "state": "FAILURE",
      "link": "https://github.com/razorpay/blade/actions/runs/1234567890",
      "problem": "<detailed reason for failure after debugging the failed job>",
      "suggestion": "<what to do to fix or unblock this>"
    }
  ],
  "issues": [
    {
      "problem": "Missing changeset bump for @razorpay/blade (packages/blade was modified)"
    }
  ]
}
```

`statuses` must include **all** CI checks — passing, failing, pending, skipped. For any check with state `FAILURE` or `PENDING`, `problem` is **required** — populate it after debugging the failed job with `gh run view`. `suggestion` is required when a fix is known. Do not omit `problem` from a failing status. `issues` holds changeset/docs/test problems with no file location.
