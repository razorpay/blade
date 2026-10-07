#!/usr/bin/env bash
# gh_get_paginated must concatenate review-comment pages without putting the
# JSON on jq's argv. A single page of PR review comments (diff hunks included)
# is enough to exceed the kernel argument limit on the self-hosted runners
# (~128KiB for argv + environment), which made the run-count check fail closed.
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# shellcheck source=../scripts/lib/gh-api.sh
source "$root/scripts/lib/gh-api.sh"

fail() {
  echo "FAIL: $*" >&2
  exit 1
}

assert_eq() {
  local got="$1" want="$2" label="$3"
  [ "$got" = "$want" ] || fail "$label: got $(printf '%q' "$got") want $(printf '%q' "$want")"
}

# --- HTTP error fails closed (non-zero), does not look like an empty page ---
gh_get() {
  echo -n "500" > "$GH_STATUS_FILE"
  echo '{"message":"boom"}'
}
if out=$(gh_get_paginated "repos/o/r/pulls/1/comments"); then
  fail "HTTP 500 must fail closed, got: $out"
fi

# --- two pages concatenate in order ---
gh_get() {
  echo -n "200" > "$GH_STATUS_FILE"
  # Match &page=N at the end. per_page=100 contains the substring "page=1".
  case "$1" in
    *'&page=1') python3 -c 'import json; print(json.dumps([{"id": i, "body": "p1"} for i in range(100)]))' ;;
    *'&page=2') echo '[{"id":100,"body":"<!-- slash-resolve-comments:auto-reply task=abc -->"}]' ;;
    *) echo '[]' ;;
  esac
}
pages=$(gh_get_paginated "repos/o/r/pulls/1/comments")
assert_eq "$(echo "$pages" | jq 'length')" "101" "two-page length"
assert_eq "$(echo "$pages" | jq -r '.[0].id')" "0" "first id"
assert_eq "$(echo "$pages" | jq -r '.[100].body')" "<!-- slash-resolve-comments:auto-reply task=abc -->" "second page body"

# --- one page larger than the argv ceiling still parses ---
# macOS ARG_MAX is ~1MiB; Linux also rejects a single argument past 128KiB.
# 1.1MiB fails on both, which is the bug the file-based merge exists to avoid.
gh_get() {
  echo -n "200" > "$GH_STATUS_FILE"
  case "$1" in
    *'&page=1')
      python3 -c 'import json,sys; json.dump([{"id":1,"body":"MARKER"+"x"*1100000},{"id":2,"body":"<!-- slash-resolve-comments:auto-reply task=big -->"}], sys.stdout); sys.stdout.write("\n")'
      ;;
    *) echo '[]' ;;
  esac
}
large=$(gh_get_paginated "repos/o/r/pulls/1/comments")
assert_eq "$(echo "$large" | jq 'length')" "2" "large page length"
assert_eq "$(echo "$large" | jq -r '.[0].body[:6]')" "MARKER" "large page body preserved"
assert_eq "$(echo "$large" | jq -r '.[1].body')" "<!-- slash-resolve-comments:auto-reply task=big -->" "marker on large page"

# --- invalid JSON fails closed rather than counting as zero runs ---
gh_get() {
  echo -n "200" > "$GH_STATUS_FILE"
  echo 'not-json'
}
if out=$(gh_get_paginated "repos/o/r/pulls/1/comments"); then
  fail "invalid JSON must fail closed, got: $out"
fi

echo "ok"
