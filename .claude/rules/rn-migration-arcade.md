# RN Migration — Downtime Arcade (reusable workflow)

> Scope: **the RN migration pipeline ONLY** (`migrate-to-rn` / the orchestrated
> RN batch in `orchestrator-guardrails.md`). Do NOT offer this during Svelte
> migration, code review, or any other task.

## When to trigger

Offer the game menu at these moments in an RN migration run:

1. **Right after kicking off** the pipeline (agents spawned, nothing for the user to do yet).
2. **While waiting at a human gate** — Plan Gate or Final Gate — or whenever agents are grinding with no user action pending.

Do not trigger outside these moments, and never auto-open a game without asking first.

## The menu

Ask via `AskUserQuestion` (single-select), exactly these options:

- **Snake**
- **RN Trivia Deck**
- **Crossword**
- **Back to staring at the ceiling** — "if you're a nerd and don't want to play games, skip it and just watch the migration terminal + human gate checks." (Picking this = launch nothing.)

## On the user's pick

- Any game → immediately run the launcher in the same turn. **The user should never have to type a run command themselves.**
  ```bash
  .claude/games/launch.sh arcade
  ```
  `arcade` opens ONE Apple Terminal window: live migration dashboard on the left
  (auto-refreshing) + the games on the right. Switch games in-window with keys
  `1` Snake · `2` Trivia · `3` Crossword · `q` quit.
- **Back to staring at the ceiling** → launch nothing; just continue watching the pipeline.

After launching, remind the user to click the arcade window to focus it (keys go
to the focused window, not the Claude session).

## Why it must be a separate window

Curses games need a real interactive TTY; the sandboxed Bash tool has no keyboard
attached. `launch.sh` uses `osascript` to open a real Terminal window so arrows/
WASD actually work. Telling the user to `!python3 ...` themselves defeats the
zero-friction goal.

## Assets

- `.claude/games/arcade.py` — single-window dashboard + game switcher (default).
- `.claude/games/snake.py`, `agent-dashboard.py` — standalone variants.
- `.claude/games/launch.sh <arcade|snake|dashboard|twowin>` — opens/positions windows.

The dashboard reads `.codex/artifacts/rn-batch-status.md` (authoritative) and
falls back to per-worktree artifacts under `.claude/worktrees/{Name}/`.
