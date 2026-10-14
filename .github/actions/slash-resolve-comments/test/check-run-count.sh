#!/usr/bin/env bash
# The run cap counts bot review submissions on the PR, not inline comments
# and not auto-reply markers. More than max_runs (4) bot reviews skips.
# Empty rzp-slash[bot] reviews are reply shells and do not count. A slash
# mention on the triggering review bypasses the cap.
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

fail() {
  echo "FAIL: $*" >&2
  exit 1
}

assert_eq() {
  local got="$1" want="$2" label="$3"
  [ "$got" = "$want" ] || fail "$label: got $(printf '%q' "$got") want $(printf '%q' "$want")"
}

# Prints a reviews-API page. Bot reviews are separate submissions; humans
# and pending bot drafts must not count.
write_reviews() {
  local submitted_bots="$1" pending_bots="$2" humans="$3" dest="$4" other_bots="${5:-0}" reply_shells="${6:-0}" empty_bots="${7:-0}"
  python3 -c '
import json, sys
submitted, pending, humans, other, shells, empty = (int(x) for x in sys.argv[1:7])
reviews = []
n = 1
for _ in range(submitted):
    # A review block: one submission with a summary. Inline comments are not separate reviews.
    reviews.append({"id": n, "state": "COMMENTED", "user": {"login": "cursor[bot]", "type": "Bot"}, "body": "Bugbot review summary"})
    n += 1
for _ in range(empty):
    # An inline-only review from a bot other than rzp-slash. The empty summary still counts.
    reviews.append({"id": n, "state": "COMMENTED", "user": {"login": "cursor[bot]", "type": "Bot"}, "body": ""})
    n += 1
for _ in range(shells):
    # GitHub creates one empty review per inline reply. That is a comment, not a review block.
    reviews.append({"id": n, "state": "COMMENTED", "user": {"login": "rzp-slash[bot]", "type": "Bot"}, "body": ""})
    n += 1
for _ in range(other):
    reviews.append({"id": n, "state": "COMMENTED", "user": {"login": "semgrep-code-razorpay[bot]", "type": "Bot"}, "body": ""})
    n += 1
for _ in range(pending):
    reviews.append({"id": n, "state": "PENDING", "user": {"login": "cursor[bot]", "type": "Bot"}, "body": "draft"})
    n += 1
for _ in range(humans):
    reviews.append({"id": n, "state": "APPROVED", "user": {"login": "alice", "type": "User"}, "body": "lgtm"})
    n += 1
json.dump(reviews, open(sys.argv[7], "w"))
' "$submitted_bots" "$pending_bots" "$humans" "$other_bots" "$reply_shells" "$empty_bots" "$dest"
}

run_case() {
  local fixture="$1" expected="$2" label="$3" http_status="${4:-200}" max_runs="${5-4}" log_expect="${6-}" comments_fixture="${7-}"
  local outdir fake_bin output log
  outdir=$(mktemp -d)
  fake_bin=$(mktemp -d)
  output="$outdir/github_output"
  log="$outdir/log"
  : > "$output"
  cat > "$fake_bin/curl" << 'EOF'
#!/usr/bin/env bash
outfile=""
prev=""
url=""
for arg in "$@"; do
  if [ "$prev" = "-o" ]; then
    outfile="$arg"
  fi
  case "$arg" in
    http*) url="$arg" ;;
  esac
  prev="$arg"
done
if [ -n "$outfile" ]; then
  if [[ "$url" == *"/comments"* ]]; then
    if [ -n "${FIXTURE_COMMENTS:-}" ]; then
      cp "$FIXTURE_COMMENTS" "$outfile"
    else
      echo '[]' > "$outfile"
    fi
  else
    cp "$FIXTURE_FILE" "$outfile"
  fi
fi
printf '%s' "${FIXTURE_STATUS:-200}"
EOF
  chmod +x "$fake_bin/curl"

  PATH="$fake_bin:$PATH" \
    GH_TOKEN=test \
    REPO=o/r \
    PR_NUMBER=1 \
    REVIEW_ID=99 \
    SLASH_MENTIONS='@rzp-slash,@razorpay/slash' \
    MAX_RUNS="$max_runs" \
    BOT_LOGIN='cursor[bot],rzp-slash[bot],rzp-slash-public[bot]' \
    HUMAN_HELP_LABEL='Human Help Needed' \
    GITHUB_OUTPUT="$output" \
    FIXTURE_FILE="$fixture" \
    FIXTURE_COMMENTS="$comments_fixture" \
    FIXTURE_STATUS="$http_status" \
    bash "$root/scripts/check-run-count.sh" > "$log" 2>&1 || fail "$label: script exited non-zero: $(cat "$log")"

  local got
  got=$(grep '^allowed=' "$output" | tail -1 | cut -d= -f2-)
  assert_eq "$got" "$expected" "$label"
  if [ -n "$log_expect" ] && ! grep -F -q "$log_expect" "$log"; then
    fail "$label: log missing $(printf '%q' "$log_expect"): $(cat "$log")"
  fi
  echo "ok $label"
  rm -rf "$outdir" "$fake_bin"
}

fixture=$(mktemp)
write_reviews 4 1 3 "$fixture"
run_case "$fixture" true "4 submitted bot reviews stay under the cap"

write_reviews 5 0 0 "$fixture"
run_case "$fixture" false "5 submitted bot reviews are beyond the cap"

write_reviews 2 0 1 "$fixture" 6
run_case "$fixture" true "bots outside bot_login do not count"

write_reviews 2 0 0 "$fixture" 0 12
run_case "$fixture" true "empty rzp-slash reply reviews are comments, not review blocks"

write_reviews 0 0 0 "$fixture" 0 0 5
run_case "$fixture" false "empty-body reviews from other bots count toward the cap"

write_reviews 0 0 0 "$fixture" 0 8
run_case "$fixture" true "only empty rzp-slash reviews stay under the cap"

python3 -c '
import json, sys
reviews = [
    {"id": i, "state": "COMMENTED", "user": {"login": "rzp-slash[bot]", "type": "Bot"}, "body": "summary"}
    for i in range(1, 6)
]
json.dump(reviews, open(sys.argv[1], "w"))
' "$fixture"
run_case "$fixture" false "rzp-slash reviews with a summary count toward the cap"

python3 -c '
import json, sys
reviews = [
    {"id": i, "state": "COMMENTED", "user": {"login": "rzp-slash-public[bot]", "type": "Bot"}, "body": ""}
    for i in range(1, 13)
]
json.dump(reviews, open(sys.argv[1], "w"))
' "$fixture"
run_case "$fixture" true "empty rzp-slash-public reply reviews are comments, not review blocks"

python3 -c '
import json, sys
reviews = [
    {"id": i, "state": "COMMENTED", "user": {"login": "rzp-slash-public[bot]", "type": "Bot"}, "body": "summary"}
    for i in range(1, 6)
]
json.dump(reviews, open(sys.argv[1], "w"))
' "$fixture"
run_case "$fixture" false "rzp-slash-public reviews with a summary count toward the cap"

comments=$(mktemp)
printf '%s' '[{"id":1,"body":"@rzp-slash please fix"}]' > "$comments"
write_reviews 5 0 0 "$fixture"
run_case "$fixture" true "slash mention bypasses the cap" 200 4 "allowing despite" "$comments"

printf '%s' '[{"id":1,"body":"@razorpay/slash please fix"}]' > "$comments"
run_case "$fixture" true "team mention bypasses the cap" 200 4 "allowing despite" "$comments"

printf '%s' '[{"id":1,"body":"please fix this"}]' > "$comments"
run_case "$fixture" false "comment without a mention stays capped" 200 4 "skipping" "$comments"

write_reviews 0 0 0 "$fixture"
printf '%s' '{"message":"nope"}' > "$fixture"
run_case "$fixture" false "reviews API error fails closed" 500

write_reviews 1 0 0 "$fixture"
run_case "$fixture" false "empty max_runs fails closed" 200 "" "Invalid max_runs"
run_case "$fixture" false "non-numeric max_runs fails closed" 200 "abc" "Invalid max_runs"

write_reviews 9 0 0 "$fixture"
run_case "$fixture" false "leading-zero max_runs is decimal" 200 "08"

write_reviews 1 0 0 "$fixture"
run_case "$fixture" false "max_runs 0 skips any bot review" 200 "0"
write_reviews 0 0 0 "$fixture"
run_case "$fixture" true "max_runs 0 still allows zero bot reviews" 200 "0"

rm -f "$fixture" "$comments"
echo "ok"
