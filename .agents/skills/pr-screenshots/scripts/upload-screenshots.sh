#!/usr/bin/env bash
# Upload PR screenshots to the `__ci_artifacts` branch on origin (the same branch
# the review bot uses for its images) and print image URLs pinned to the upload
# commit, ready to paste into a PR body.
#
# Usage (run from inside the repo, on the PR's branch):
#   upload-screenshots.sh <image> [<image> ...]
#
# Images land in `artifacts/pr-screenshots/<current-branch>/<file-name>`.
# It writes git objects directly instead of checking the branch out, so your
# working tree, index and current branch are untouched and the images never
# show up in the PR's own diff.
#
# Env overrides:
#   PR_SCREENSHOTS_REMOTE  remote to push to (default: origin)
#   PR_SCREENSHOTS_BRANCH  asset branch name (default: __ci_artifacts)
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "usage: $0 <image> [<image> ...]" >&2
  exit 1
fi

remote="${PR_SCREENSHOTS_REMOTE:-origin}"
asset_branch="${PR_SCREENSHOTS_BRANCH:-__ci_artifacts}"
folder="artifacts/pr-screenshots/$(git rev-parse --abbrev-ref HEAD)"

remote_url="$(git remote get-url "$remote")"
repo="$(printf '%s' "$remote_url" | sed -E 's#^(git@github\.com:|https://github\.com/)##; s#\.git$##')"

for f in "$@"; do
  [ -f "$f" ] || { echo "not a file: $f" >&2; exit 1; }
  case "$(basename "$f")" in
    *[!A-Za-z0-9._-]*) echo "rename '$f' to use only letters, digits, '.', '_' or '-' (it goes into a URL)" >&2; exit 1 ;;
  esac
done

# Build on top of the existing asset branch, if there is one, so everything already on it stays.
parent=""
if git fetch -q "$remote" "refs/heads/${asset_branch}" 2>/dev/null; then
  parent="$(git rev-parse FETCH_HEAD)"
fi

tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT
export GIT_INDEX_FILE="$tmp_dir/index"

git read-tree "${parent:---empty}"

for f in "$@"; do
  blob="$(git hash-object -w "$f")"
  git update-index --add --cacheinfo 100644 "$blob" "${folder}/$(basename "$f")"
done

tree="$(git write-tree)"
unset GIT_INDEX_FILE

commit="$(git commit-tree "$tree" ${parent:+-p "$parent"} -m "chore: add pr screenshots for ${folder#artifacts/pr-screenshots/}")"

git push -q "$remote" "${commit}:refs/heads/${asset_branch}"

for f in "$@"; do
  echo "https://raw.githubusercontent.com/${repo}/${commit}/${folder}/$(basename "$f")"
done
