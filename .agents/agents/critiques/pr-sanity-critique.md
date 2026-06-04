---
name: pr-sanity-critique
description: Reviews PR sanity — CI status, changeset, docs, and tests. Spawned by review-pr skill.
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

Add any `issues` from the output to `sanity_issues`.

## Output

```json
{
  "pr_number": 1234,
  "ci_checks": [
    {
      "name": "Check 1 name",
      "state": "SUCCESS",
      "link": "https://github.com/razorpay/blade/actions/runs/1234567890"
      // and other properties from the output
    },
    {
      "name": "Check 2 name",
      "state": "FAILURE",
      "link": "https://github.com/razorpay/blade/actions/runs/1234567890",
      // and other properties from the output
      "failure_reason": "<detailed reason for failure after debugging the failed job>"
    }
  ],
  "sanity_issues": ["Missing changeset: ..."]
}
```

`ci_checks` must include **all** checks — passing, failing, pending, etc etc. Only include `failure_reason` for non-SUCCESS/non-SKIPPED checks.
