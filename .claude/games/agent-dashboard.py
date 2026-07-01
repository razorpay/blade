#!/usr/bin/env python3
"""Live RN-migration agent dashboard. Run from repo root. Ctrl-C to quit.

Derives each component's phase from worktree artifacts + git state, and overlays
the authoritative table in .codex/artifacts/rn-batch-status.md when present.
"""
import os
import re
import subprocess
import time
from datetime import datetime

ROOT = os.getcwd()
WORKTREES = os.path.join(ROOT, ".claude", "worktrees")
BATCH_STATUS = os.path.join(ROOT, ".codex", "artifacts", "rn-batch-status.md")
REFRESH = 2.0

RESET = "\033[0m"
BOLD = "\033[1m"
DIM = "\033[2m"
GREEN = "\033[32m"
YELLOW = "\033[33m"
CYAN = "\033[36m"
GREY = "\033[90m"
RED = "\033[31m"

DONE, PROG, PEND = "done", "in progress", "pending"

BADGE = {
    DONE: f"{GREEN}● done      {RESET}",
    PROG: f"{YELLOW}◐ running   {RESET}",
    PEND: f"{GREY}○ pending   {RESET}",
}


def sh(args, cwd=None):
    try:
        return subprocess.run(
            args, cwd=cwd, capture_output=True, text=True, timeout=8
        ).stdout.strip()
    except Exception:
        return ""


def artifact_dir(wt, name):
    for base in (".claude/artifacts", ".codex/artifacts"):
        p = os.path.join(wt, base, name)
        if os.path.isdir(p):
            return p
    return None


def has(adir, fname):
    return bool(adir) and os.path.isfile(os.path.join(adir, fname))


def parse_batch_status():
    """Return {component_lower: {plan,execute,verify,pr}} from the md table."""
    out = {}
    if not os.path.isfile(BATCH_STATUS):
        return out
    with open(BATCH_STATUS) as f:
        for line in f:
            cells = [c.strip() for c in line.strip().strip("|").split("|")]
            if len(cells) < 6:
                continue
            comp = cells[0].lower()
            if comp in ("component", "---------") or comp.startswith("---"):
                continue
            out[comp] = {
                "plan": cells[1], "execute": cells[2],
                "verify": cells[3], "pr": cells[4], "note": cells[5],
            }
    return out


def norm(v):
    v = (v or "").lower()
    if "done" in v or "✅" in v:
        return DONE
    if "progress" in v or "🟡" in v or "implement" in v:
        return PROG
    return PEND


def infer(name, wt, override):
    adir = artifact_dir(wt, name)
    branch = sh(["git", "-C", wt, "branch", "--show-current"])

    plan = DONE if (has(adir, "rn-discovery-report.md") and
                    has(adir, "rn-migration-plan.md")) else (
        PROG if has(adir, "rn-discovery-report.md") else PEND)

    verify_done = has(adir, "rn-verification-report.md")

    dirty = bool(sh(["git", "-C", wt, "status", "--porcelain"]))
    ahead = sh(["git", "-C", wt, "log", "--oneline", "origin/master..HEAD"])
    ncommits = len([l for l in ahead.splitlines() if l.strip()])

    if verify_done or ncommits:
        execute = DONE
    elif plan == DONE and dirty:
        execute = PROG
    else:
        execute = PEND

    verify = DONE if verify_done else (PROG if execute == DONE else PEND)

    pushed = bool(sh(["git", "-C", wt, "rev-parse", "--verify", "--quiet",
                      f"refs/remotes/origin/{branch}"]))
    pr = DONE if pushed else PEND

    # authoritative table wins where it speaks
    if override:
        plan = norm(override.get("plan", plan)) if override.get("plan") else plan
        execute = norm(override["execute"]) if override.get("execute") else execute
        verify = norm(override["verify"]) if override.get("verify") else verify

    note = override.get("note", "") if override else ""
    screenshots = 0
    if adir and os.path.isdir(os.path.join(adir, "screenshots")):
        screenshots = len(os.listdir(os.path.join(adir, "screenshots")))
    return {
        "branch": branch, "plan": plan, "execute": execute,
        "verify": verify, "pr": pr, "commits": ncommits,
        "shots": screenshots, "note": note,
    }


def gate(row):
    """Is this component sitting at a human gate?"""
    if row["plan"] == DONE and row["execute"] == PEND:
        return "PLAN GATE — awaiting approval"
    if row["verify"] == DONE and row["pr"] == PEND:
        return "FINAL GATE — awaiting PR approval"
    return ""


def render():
    comps = sorted(
        [d for d in os.listdir(WORKTREES)
         if os.path.isdir(os.path.join(WORKTREES, d))]
    ) if os.path.isdir(WORKTREES) else []
    batch = parse_batch_status()

    lines = []
    ts = datetime.now().strftime("%H:%M:%S")
    lines.append(f"{BOLD}{CYAN}  RN MIGRATION — AGENT DASHBOARD{RESET}   {DIM}{ts}  ↻{int(REFRESH)}s  ^C quit{RESET}")
    lines.append(f"{GREY}  {'─'*66}{RESET}")
    lines.append(f"  {BOLD}{'Component':<13}{'Plan':<12}{'Execute':<12}{'Verify':<12}{'PR':<6}{RESET}")

    gates = []
    for c in comps:
        wt = os.path.join(WORKTREES, c)
        row = infer(c, wt, batch.get(c.lower()))
        pr_cell = f"{GREEN}✓{RESET}" if row["pr"] == DONE else f"{GREY}—{RESET}"
        lines.append(
            f"  {BOLD}{c:<13}{RESET}"
            f"{BADGE[row['plan']]}{BADGE[row['execute']]}{BADGE[row['verify']]}"
            f"{pr_cell:<6}"
        )
        meta = []
        if row["commits"]:
            meta.append(f"{row['commits']} commits")
        if row["shots"]:
            meta.append(f"{row['shots']} shots")
        if row["note"] and row["note"] != "-":
            meta.append(row["note"])
        if meta:
            lines.append(f"  {GREY}{'':<13}{' · '.join(meta)}{RESET}")
        g = gate(row)
        if g:
            gates.append((c, g))

    lines.append(f"{GREY}  {'─'*66}{RESET}")
    if gates:
        lines.append(f"  {BOLD}{RED}⚑ NEEDS YOU:{RESET}")
        for c, g in gates:
            lines.append(f"    {YELLOW}{c}{RESET} — {g}")
    else:
        lines.append(f"  {DIM}no human gate pending — agents grinding{RESET}")
    lines.append("")
    lines.append(f"  {DIM}legend: {GREEN}● done  {YELLOW}◐ running  {GREY}○ pending{RESET}")
    return "\n".join(lines)


def main():
    try:
        while True:
            frame = render()
            # clear + home, then paint (avoids flicker vs full clear)
            print("\033[H\033[J" + frame, end="", flush=True)
            time.sleep(REFRESH)
    except KeyboardInterrupt:
        print(RESET + "\n  dashboard closed.\n")


if __name__ == "__main__":
    main()
