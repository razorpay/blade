#!/usr/bin/env bash
set -euo pipefail

authorized="false"

is_bot_login="false"
IFS=',' read -ra BOT_LOGIN_ARRAY <<< "$BOT_LOGIN"
for bot in "${BOT_LOGIN_ARRAY[@]}"; do
  bot_trimmed=$(echo "$bot" | xargs)
  if [ "$ACTOR" = "$bot_trimmed" ]; then
    is_bot_login="true"
    break
  fi
done

if [ -z "$ALLOWED_USERNAMES" ]; then
  echo "No allowed_usernames configured — everyone is authorized."
  authorized="true"
elif [ "$ACTOR" = "$PR_AUTHOR" ]; then
  echo "Actor is the PR author — authorized."
  authorized="true"
elif [ "$is_bot_login" = "true" ]; then
  echo "Actor is $ACTOR — authorized bot comment resolution."
  authorized="true"
else
  IFS=',' read -ra ALLOWED_ARRAY <<< "$ALLOWED_USERNAMES"
  for allowed in "${ALLOWED_ARRAY[@]}"; do
    allowed_trimmed=$(echo "$allowed" | xargs)
    if [ "$ACTOR" = "$allowed_trimmed" ]; then
      echo "Actor '$ACTOR' is in allowed_usernames — authorized."
      authorized="true"
      break
    fi
  done
  if [ "$authorized" = "false" ]; then
    echo "Actor '$ACTOR' is not the PR author, bot, or in allowed_usernames — skipping."
  fi
fi

echo "authorized=$authorized" >> "$GITHUB_OUTPUT"
