#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "${BASH_SOURCE[0]}")/lib/gh-api.sh"

RETRY_ATTEMPTS=3
RETRY_DELAY_SECONDS=3

# Documented usage is pull_request_review, which always has
# github.event.pull_request.head.ref (passed as EVENT_HEAD_REF). Fetch the
# PR only when that context is missing so other triggers can still resolve
# the head branch without paying an extra API call on the hot path.
head_ref="${EVENT_HEAD_REF:-}"
if [ -z "$head_ref" ]; then
  pr_json=$(gh_get "repos/${REPO}/pulls/${PR_NUMBER}")
  head_ref=$(echo "$pr_json" | jq -r '.head.ref // empty' 2>/dev/null || echo "")
fi
echo "head_ref=$head_ref" >> "$GITHUB_OUTPUT"

review_json=$(gh_get "repos/${REPO}/pulls/${PR_NUMBER}/reviews/${REVIEW_ID}")
review_submitted_at=$(echo "$review_json" | jq -r '.submitted_at // "unknown"' 2>/dev/null || echo "unknown")
echo "Review ${REVIEW_ID} submitted_at=${review_submitted_at} (http_status=$(gh_last_status))"

all_comments="[]"
for attempt in $(seq 1 "$RETRY_ATTEMPTS"); do
  elapsed=$SECONDS
  body=$(gh_get "repos/${REPO}/pulls/${PR_NUMBER}/reviews/${REVIEW_ID}/comments")
  last_status=$(gh_last_status)
  if [[ "$last_status" == 2* ]]; then
    all_comments="$body"
  else
    all_comments="[]"
  fi
  comment_array_length=$(echo "$all_comments" | jq 'length' 2>/dev/null || echo "0")
  echo "attempt ${attempt}: review-scoped endpoint returned ${comment_array_length} comment(s) (elapsed ${elapsed}s, http_status=${last_status})"

  [ "$comment_array_length" -gt 0 ] && break
  if [ "$attempt" -lt "$RETRY_ATTEMPTS" ]; then
    echo "Review comments API returned empty on attempt $attempt/$RETRY_ATTEMPTS — retrying in ${RETRY_DELAY_SECONDS}s (possible read-after-write lag)."
    sleep "$RETRY_DELAY_SECONDS"
  fi
done

# Build a JSON array of trimmed mention strings for jq (passed as data, never
# spliced into the jq program text).
IFS=',' read -ra MENTION_ARRAY <<< "$SLASH_MENTIONS"
mentions_json="[]"
for mention in "${MENTION_ARRAY[@]}"; do
  mention_trimmed=$(echo "$mention" | xargs)
  [ -z "$mention_trimmed" ] && continue
  mentions_json=$(jq -c --arg m "$mention_trimmed" '. + [$m]' <<< "$mentions_json")
done

IFS=',' read -ra BOT_ARRAY <<< "$BOT_LOGIN"
bots_json="[]"
for bot in "${BOT_ARRAY[@]}"; do
  bot_trimmed=$(echo "$bot" | xargs)
  [ -z "$bot_trimmed" ] && continue
  bots_json=$(jq -c --arg b "$bot_trimmed" '. + [$b]' <<< "$bots_json")
done

# Eligible comments:
# 1. Comments that mention any of the slash mention strings (manual delegation)
# 2. Top-level comments posted by any of the configured bot logins
#
# Bot replies are never eligible — even if the body contains a mention —
# so a resolver/reviewer bot answering a thread cannot re-trigger itself.
# Human replies with an explicit mention still match rule 1.
# Our own auto-reply marker is also excluded (posted by github-actions).
jq_filter='[.[] | select(
  (.user.login as $login | $bots | any(. == $login)) as $is_bot
  | (
      ((.body as $b | $mentions | any(. as $m | $b | contains($m))) or $is_bot)
      and (($is_bot and (.in_reply_to_id != null)) | not)
      and ((.body // "") | contains("<!-- slash-resolve-comments:auto-reply") | not)
    )
)]'

skipped_bot_replies=$(echo "$all_comments" | jq --argjson bots "$bots_json" \
  '[.[] | select((.user.login as $login | $bots | any(. == $login)) and (.in_reply_to_id != null))] | length')
if [ "$skipped_bot_replies" -gt 0 ]; then
  echo "Skipping ${skipped_bot_replies} bot reply comment(s) to prevent a resolve feedback loop."
fi

selected=$(echo "$all_comments" | jq -r --argjson mentions "$mentions_json" --argjson bots "$bots_json" \
  "$jq_filter | .[].html_url")

if [ -z "$selected" ] || [ "$selected" = "" ]; then
  echo "No eligible comments in this review, skipping."
  echo "has_comments=false" >> "$GITHUB_OUTPUT"
  exit 0
fi

comment_urls=$(echo "$selected" | sort -u)
comment_count=$(echo "$comment_urls" | wc -l | tr -d ' ')
echo "Found $comment_count eligible comment(s)."

# Store comment IDs for posting replies
comment_ids=$(echo "$all_comments" | jq -r --argjson mentions "$mentions_json" --argjson bots "$bots_json" \
  "$jq_filter | .[].id")

eof_tag="__SLASH_EOF_${$}_${RANDOM}__"
{
  echo "comment_ids<<${eof_tag}"
  echo "$comment_ids"
  echo "${eof_tag}"
} >> "$GITHUB_OUTPUT"

# Build prompt from template
comment_urls_newline=$(echo "$comment_urls" | tr '\n' ' ' | sed 's/ $//')
# Replace newlines in template with actual newlines, then substitute placeholders
prompt=$(echo "$PROMPT_TEMPLATE" | sed 's/\\n/\n/g' \
  | sed "s|{pr_number}|$PR_NUMBER|g" \
  | sed "s|{comment_urls}|$comment_urls_newline|g")

eof_tag="__SLASH_EOF_${$}_${RANDOM}__"
{
  echo "prompt<<${eof_tag}"
  echo "$prompt"
  echo "${eof_tag}"
} >> "$GITHUB_OUTPUT"
echo "has_comments=true" >> "$GITHUB_OUTPUT"
