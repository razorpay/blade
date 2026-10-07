#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "${BASH_SOURCE[0]}")/lib/gh-api.sh"

# Count review blocks from bot_login: one submitted review, with or without a
# summary. GitHub also creates an empty review for each inline reply, and
# those show up as rzp-slash[bot] / rzp-slash-public[bot] with an empty body.
# Only that shell is left out. An empty summary from any other bot_login still
# counts. Pending drafts do not count.
# Fail closed: an API error must not look like "zero bot reviews".
if ! all_reviews=$(gh_get_paginated "repos/${REPO}/pulls/${PR_NUMBER}/reviews"); then
  echo "Failed to fetch PR reviews for bot-review check (status $(gh_last_status)) — failing closed."
  echo "allowed=false" >> "$GITHUB_OUTPUT"
  exit 0
fi

IFS=',' read -ra BOT_ARRAY <<< "${BOT_LOGIN:-}"
bots_json="[]"
for bot in "${BOT_ARRAY[@]}"; do
  bot_trimmed=$(echo "$bot" | xargs)
  [ -z "$bot_trimmed" ] && continue
  bots_json=$(jq -c --arg b "$bot_trimmed" '. + [$b]' <<< "$bots_json")
done

COUNT=$(echo "$all_reviews" | jq --argjson bots "$bots_json" '
  [
    .[]
    | select(.state != "PENDING")
    | select(.user.login as $login | $bots | index($login) != null)
    | select(
        ((.user.login | IN("rzp-slash[bot]", "rzp-slash-public[bot]")) | not)
        or ((.body // "") | gsub("\\s"; "") != "")
      )
    | .id
  ] | unique | length
' 2>/dev/null || echo "")

if ! [[ "$COUNT" =~ ^[0-9]+$ ]]; then
  echo "Failed to parse bot-review count — failing closed."
  echo "allowed=false" >> "$GITHUB_OUTPUT"
  exit 0
fi

# An empty or non-numeric max_runs makes `[ count -gt max ]` a non-integer
# comparison. Inside `if` that is false, so the script would allow the run.
if ! [[ "${MAX_RUNS:-}" =~ ^[0-9]+$ ]]; then
  echo "Invalid max_runs '${MAX_RUNS:-}' — failing closed."
  echo "allowed=false" >> "$GITHUB_OUTPUT"
  exit 0
fi

echo "PR has ${COUNT} submitted bot review(s) (max: ${MAX_RUNS})."

# Base 10: on the Ubuntu runner, `[ 9 -gt 08 ]` errors (octal) inside `if`
# and would fail open the same way.
if [ "$((10#$COUNT))" -gt "$((10#$MAX_RUNS))" ]; then
  # A slash mention is a human asking for this review to be resolved. It
  # bypasses the cap. The check is the comments on this review, which is the
  # same set fetch-comments.sh will select from.
  has_manual="false"
  if [ -n "${REVIEW_ID:-}" ]; then
    if ! comments_json=$(gh_get_paginated "repos/${REPO}/pulls/${PR_NUMBER}/reviews/${REVIEW_ID}/comments"); then
      echo "Failed to fetch review comments for mention check — not treating this as a manual override."
      comments_json="[]"
    fi
    IFS=',' read -ra MENTION_ARRAY <<< "${SLASH_MENTIONS:-}"
    for mention in "${MENTION_ARRAY[@]}"; do
      mention_trimmed=$(echo "$mention" | xargs)
      [ -z "$mention_trimmed" ] && continue
      if echo "$comments_json" | jq -e --arg m "$mention_trimmed" '[.[] | select((.body // "") | contains($m))] | length > 0' >/dev/null 2>&1; then
        has_manual="true"
        echo "Review contains explicit ${mention_trimmed} mention — allowing despite limit."
        break
      fi
    done
  fi

  if [ "$has_manual" = "true" ]; then
    echo "allowed=true" >> "$GITHUB_OUTPUT"
  else
    echo "More than ${MAX_RUNS} bot reviews — skipping."
    if [ -n "${HUMAN_HELP_LABEL:-}" ]; then
      label_body=$(jq -n --arg l "$HUMAN_HELP_LABEL" '{labels: [$l]}')
      gh_post "repos/${REPO}/issues/${PR_NUMBER}/labels" "$label_body" >/dev/null 2>&1 || true
      label_status=$(gh_last_status)
      if [[ "$label_status" == 2* ]]; then
        echo "Added '${HUMAN_HELP_LABEL}' label to PR #${PR_NUMBER}."
      else
        echo "Failed to add '${HUMAN_HELP_LABEL}' label (status ${label_status}; may already exist)."
      fi
    fi
    echo "allowed=false" >> "$GITHUB_OUTPUT"
  fi
else
  echo "allowed=true" >> "$GITHUB_OUTPUT"
fi
