# PR Sanity

## CI Checks

Fetch all CI checks and report their status:

```bash
gh pr checks {PR_NUMBER} --repo razorpay/blade --json name,description,link,state,startedAt,completedAt,workflow
```

For any failing checks, get details to explain the root cause:

```bash
gh run view --job {JOB_ID} --repo razorpay/blade
```

Report every check — passing, failing, pending, skipped. For non-SUCCESS checks include the root cause and a suggestion to fix or unblock.

## Changeset Coverage

Verify that every modified package has a changeset bump:

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

Flag any missing bumps as issues.
