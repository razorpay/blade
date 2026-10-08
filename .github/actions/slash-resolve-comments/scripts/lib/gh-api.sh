# Minimal curl-based GitHub REST API helpers. Avoids depending on the `gh`
# CLI binary, which is not guaranteed to be present on every self-hosted
# runner image (unlike GitHub-hosted ubuntu-latest, which ships it).
#
# Auth: expects GH_TOKEN in the environment.
#
# Callers invoke gh_get/gh_get_paginated/gh_post via command substitution
# (e.g. body=$(gh_get "...")), which runs the function in a subshell — any
# plain variable assigned inside the function (like a would-be
# GH_LAST_STATUS=...) is lost when that subshell exits. So status/headers
# are instead persisted to fixed temp files and read back via
# gh_last_status/gh_last_headers after the substitution completes.

GH_API_BASE_URL="${GH_API_BASE_URL:-https://api.github.com}"
GH_STATUS_FILE="${GH_STATUS_FILE:-$(mktemp)}"
GH_HEADERS_FILE="${GH_HEADERS_FILE:-$(mktemp)}"

gh_last_status() {
  cat "$GH_STATUS_FILE" 2>/dev/null || echo "000"
}

gh_last_headers() {
  cat "$GH_HEADERS_FILE" 2>/dev/null || echo ""
}

gh_get() {
  local path="$1"
  local body_file status
  body_file=$(mktemp)
  status=$(curl -sS --max-time 30 --connect-timeout 10 \
    -o "$body_file" -D "$GH_HEADERS_FILE" -w '%{http_code}' \
    -H "Authorization: Bearer ${GH_TOKEN}" \
    -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    "${GH_API_BASE_URL}/${path}") || status="000"
  echo -n "$status" > "$GH_STATUS_FILE"
  cat "$body_file"
  rm -f "$body_file"
}

# Follows pagination via per_page/page, concatenating JSON array responses.
#
# Pages are merged through temp files. jq --argjson puts each page on the
# command line, and the kernel rejects that ("Argument list too long") once
# argv plus the Actions environment passes ~128KiB. One page of review
# comments crosses that line because every comment includes its diff hunk.
# Callers capture this function inside `if !`, which disables set -e for the
# whole body, so a failed merge has to return non-zero itself. Echoing nothing
# and returning 0 looks like "zero comments" and fail-opens the run-count check.
gh_get_paginated() {
  local path="$1"
  local page=1
  local sep="?"
  [[ "$path" == *"?"* ]] && sep="&"
  local acc_file body_file next_file count
  acc_file=$(mktemp)
  body_file=$(mktemp)
  next_file=$(mktemp)
  echo '[]' > "$acc_file"

  local rc=0
  while true; do
    gh_get "${path}${sep}per_page=100&page=${page}" > "$body_file" || true
    if [[ "$(gh_last_status)" != 2* ]]; then
      rc=1
      break
    fi
    if ! count=$(jq 'length' "$body_file" 2>/dev/null); then
      rc=1
      break
    fi
    [ "$count" -eq 0 ] && break
    if ! jq -c -n --slurpfile a "$acc_file" --slurpfile b "$body_file" '$a[0] + $b[0]' > "$next_file"; then
      rc=1
      break
    fi
    mv "$next_file" "$acc_file"
    [ "$count" -lt 100 ] && break
    page=$((page + 1))
  done

  cat "$acc_file"
  rm -f "$acc_file" "$body_file" "$next_file"
  return "$rc"
}

gh_post() {
  local path="$1"
  local json_body="$2"
  local body_file status
  body_file=$(mktemp)
  status=$(curl -sS --max-time 30 --connect-timeout 10 \
    -o "$body_file" -D "$GH_HEADERS_FILE" -w '%{http_code}' -X POST \
    -H "Authorization: Bearer ${GH_TOKEN}" \
    -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    -H "Content-Type: application/json" \
    -d "$json_body" \
    "${GH_API_BASE_URL}/${path}") || status="000"
  echo -n "$status" > "$GH_STATUS_FILE"
  cat "$body_file"
  rm -f "$body_file"
}
