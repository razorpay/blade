#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "${BASH_SOURCE[0]}")/lib/gh-api.sh"

execution_url="${EXECUTION_LOGS_BASE_URL%/}/tasks/${TASK_ID}/execution-logs"

# Build reply message from template. The trailing HTML comment marks this
# reply so fetch-comments.sh does not treat it as a new comment to resolve.
# It must stay present regardless of reply_template customization.
reply_message=$(echo "$REPLY_TEMPLATE" | sed "s|{execution_url}|$execution_url|g")
reply_message="${reply_message}
<!-- slash-resolve-comments:auto-reply task=${TASK_ID} -->"

reply_json=$(jq -n --arg b "$reply_message" '{body: $b}')

while IFS= read -r comment_id; do
  [ -z "$comment_id" ] && continue
  gh_post "repos/${REPO}/pulls/${PR_NUMBER}/comments/${comment_id}/replies" "$reply_json" >/dev/null 2>&1 || true
  if [[ "$(gh_last_status)" == 2* ]]; then
    echo "Posted reply on comment $comment_id"
  else
    echo "Failed to post reply on comment $comment_id (status $(gh_last_status))"
  fi
done <<< "$COMMENT_IDS"
