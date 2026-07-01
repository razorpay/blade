#!/usr/bin/env python3
"""One terminal, two panes: RN-migration dashboard + game menu (left) and the
active game (right). Switch games without leaving the window.

Global keys:  1 Snake · 2 Trivia · 3 Crossword · q quit
Dashboard data refreshes in a background thread so scans never stall a game.
"""
import curses
import os
import random
import subprocess
import textwrap
import threading
import time

ROOT = os.getcwd()
WORKTREES = os.path.join(ROOT, ".claude", "worktrees")
BATCH_STATUS = os.path.join(ROOT, ".codex", "artifacts", "rn-batch-status.md")

DONE, PROG, PEND = "done", "in progress", "pending"

_dash = {"rows": [], "gates": [], "ts": ""}
_lock = threading.Lock()
_stop = threading.Event()


# ---------- dashboard data (background thread) ----------
def sh(args):
    try:
        return subprocess.run(args, capture_output=True, text=True,
                              timeout=6).stdout.strip()
    except Exception:
        return ""


def artifact_dir(wt, name):
    for base in (".claude/artifacts", ".codex/artifacts"):
        p = os.path.join(wt, base, name)
        if os.path.isdir(p):
            return p
    return None


def has(adir, f):
    return bool(adir) and os.path.isfile(os.path.join(adir, f))


def norm(v):
    v = (v or "").lower()
    if "done" in v or "✅" in v:
        return DONE
    if "progress" in v or "🟡" in v or "implement" in v:
        return PROG
    return PEND


def parse_batch_status():
    out = {}
    if not os.path.isfile(BATCH_STATUS):
        return out
    try:
        with open(BATCH_STATUS) as f:
            for line in f:
                cells = [c.strip() for c in line.strip().strip("|").split("|")]
                if len(cells) < 6:
                    continue
                comp = cells[0].lower()
                if comp == "component" or comp.startswith("---"):
                    continue
                out[comp] = {"plan": cells[1], "execute": cells[2],
                             "verify": cells[3]}
    except Exception:
        pass
    return out


def collect():
    rows, gates = [], []
    if not os.path.isdir(WORKTREES):
        return rows, gates
    batch = parse_batch_status()
    for c in sorted(os.listdir(WORKTREES)):
        wt = os.path.join(WORKTREES, c)
        if not os.path.isdir(wt):
            continue
        adir = artifact_dir(wt, c)
        branch = sh(["git", "-C", wt, "branch", "--show-current"])
        plan = DONE if (has(adir, "rn-discovery-report.md") and
                        has(adir, "rn-migration-plan.md")) else (
            PROG if has(adir, "rn-discovery-report.md") else PEND)
        verify_done = has(adir, "rn-verification-report.md")
        dirty = bool(sh(["git", "-C", wt, "status", "--porcelain"]))
        ncommits = len([l for l in sh(
            ["git", "-C", wt, "log", "--oneline", "origin/master..HEAD"]
        ).splitlines() if l.strip()])
        execute = DONE if (verify_done or ncommits) else (
            PROG if (plan == DONE and dirty) else PEND)
        verify = DONE if verify_done else (PROG if execute == DONE else PEND)
        pushed = bool(sh(["git", "-C", wt, "rev-parse", "--verify", "--quiet",
                          f"refs/remotes/origin/{branch}"]))
        pr = DONE if pushed else PEND
        ov = batch.get(c.lower())
        if ov:
            plan = norm(ov["plan"]) if ov.get("plan") else plan
            execute = norm(ov["execute"]) if ov.get("execute") else execute
            verify = norm(ov["verify"]) if ov.get("verify") else verify
        rows.append({"name": c, "plan": plan, "execute": execute,
                     "verify": verify, "pr": pr})
        if plan == DONE and execute == PEND:
            gates.append(f"{c}: PLAN GATE")
        elif verify == DONE and pr == PEND:
            gates.append(f"{c}: FINAL GATE")
    return rows, gates


def dash_worker():
    while not _stop.is_set():
        rows, gates = collect()
        with _lock:
            _dash.update(rows=rows, gates=gates, ts=time.strftime("%H:%M:%S"))
        _stop.wait(3.0)


# ---------- color helpers ----------
def cp(n):
    return curses.color_pair(n) if curses.has_colors() else 0


DOT = {DONE: ("●", 1), PROG: ("◐", 3), PEND: ("○", 4)}


# ---------- games ----------
class Snake:
    name = "Snake"

    def __init__(self, h, w):
        self.h, self.w = h, w
        self.reset()

    def reset(self):
        cy, cx = self.h // 2, self.w // 4
        self.snake = [(cy, cx), (cy, cx - 1), (cy, cx - 2)]
        self.dir = curses.KEY_RIGHT
        self.food = (self.h // 2, self.w // 2)
        self.score = 0
        self.tick = 0.12
        self.over = False
        self._last = time.time()

    def on_key(self, key):
        kmap = {ord('w'): curses.KEY_UP, ord('s'): curses.KEY_DOWN,
                ord('a'): curses.KEY_LEFT, ord('d'): curses.KEY_RIGHT}
        opp = {curses.KEY_UP: curses.KEY_DOWN, curses.KEY_DOWN: curses.KEY_UP,
               curses.KEY_LEFT: curses.KEY_RIGHT, curses.KEY_RIGHT: curses.KEY_LEFT}
        if self.over:
            if key in (ord('r'), ord('R')):
                self.reset()
            return
        key = kmap.get(key, key)
        if key in (curses.KEY_UP, curses.KEY_DOWN, curses.KEY_LEFT,
                   curses.KEY_RIGHT) and key != opp.get(self.dir):
            self.dir = key

    def update(self, now):
        if self.over or now - self._last < self.tick:
            return
        self._last = now
        hy, hx = self.snake[0]
        d = self.dir
        hy += (d == curses.KEY_DOWN) - (d == curses.KEY_UP)
        hx += (d == curses.KEY_RIGHT) - (d == curses.KEY_LEFT)
        head = (hy, hx)
        if (hy <= 0 or hy >= self.h - 1 or hx <= 0 or hx >= self.w - 1
                or head in self.snake):
            self.over = True
            return
        self.snake.insert(0, head)
        if head == self.food:
            self.score += 1
            self.tick = max(0.05, self.tick - 0.004)
            while True:
                f = (random.randint(1, self.h - 2), random.randint(1, self.w - 2))
                if f not in self.snake:
                    self.food = f
                    break
        else:
            self.snake.pop()

    def render(self, win, h, w):
        win.box()
        title = f" snake  score:{self.score} "
        win.addstr(0, max(1, (w - len(title)) // 2), title[:w - 2], cp(5))
        fy, fx = self.food
        if fy < h - 1 and fx < w - 1:
            win.addch(fy, fx, ord('@'), cp(2))
        for i, (y, x) in enumerate(self.snake):
            if 0 < y < h - 1 and 0 < x < w - 1:
                win.addch(y, x, ord('O') if i == 0 else ord('o'),
                          cp(1) | curses.A_BOLD)
        if self.over:
            m = f" game over · score {self.score} · r restart "
            win.addstr(h // 2, max(1, (w - len(m)) // 2), m[:w - 2],
                       cp(2) | curses.A_BOLD)


TRIVIA = [
    ("flexDirection defaults to?", ["row", "column", "flex", "inline"], 1,
     "RN defaults to column; web CSS defaults to row."),
    ("HTML <button> maps to which RN primitive?",
     ["TouchableOpacity", "Pressable", "Button", "View"], 1,
     "Use Pressable — TouchableOpacity is deprecated."),
    ("Inset boxShadow in RN?",
     ["elevation", "shadow* props", "remove entirely", "borderShadow"], 2,
     "css-to-react-native can't parse inset shadows."),
    ("A raw string in RN must be wrapped in?",
     ["View", "Text", "Div", "Label"], 1,
     "RN crashes without a <Text> wrapper around strings."),
    ("CSS transitions become?",
     ["Animated API", "reanimated", "@keyframes", "nothing"], 1,
     "Use react-native-reanimated (withTiming/withSpring)."),
    ("onClick becomes?", ["onTap", "onPress", "onClick", "onTouch"], 1,
     "MouseEvent → GestureResponderEvent."),
    ("input onChange becomes?",
     ["onChange", "onChangeText", "onInput", "onType"], 1,
     "onChangeText receives a string, not an event."),
    ("styled-components import for native?",
     ["styled-components", "styled-components/native", "styled/native", "rn-sc"], 1,
     "Import from styled-components/native."),
    ("position: fixed becomes?",
     ["absolute", "relative", "sticky", "stays fixed"], 0,
     "No fixed positioning in RN — use absolute."),
    ("CSS Grid in RN?",
     ["supported", "flexbox only", "grid-native", "FlatGrid"], 1,
     "No grid in RN; flexbox only."),
]


class Trivia:
    name = "Trivia"

    def __init__(self, h, w):
        self.reset()

    def reset(self):
        self.order = list(range(len(TRIVIA)))
        random.shuffle(self.order)
        self.i = 0
        self.score = 0
        self.answered = None  # index chosen
        self.done = False

    def on_key(self, key):
        if self.done:
            if key in (ord('r'), ord('R')):
                self.reset()
            return
        q = TRIVIA[self.order[self.i]]
        if self.answered is None:
            if key in (ord('a'), ord('b'), ord('c'), ord('d')):
                choice = key - ord('a')
                if choice < len(q[1]):
                    self.answered = choice
                    if choice == q[2]:
                        self.score += 1
        else:
            if key in (ord(' '), ord('\n'), curses.KEY_ENTER, 10, 13):
                self.answered = None
                self.i += 1
                if self.i >= len(self.order):
                    self.done = True

    def update(self, now):
        pass

    def render(self, win, h, w):
        win.box()
        title = " RN Trivia Deck "
        win.addstr(0, max(1, (w - len(title)) // 2), title[:w - 2], cp(5))
        if self.done:
            m = f" deck cleared · {self.score}/{len(TRIVIA)} · r replay "
            win.addstr(h // 2, max(1, (w - len(m)) // 2), m[:w - 2],
                       cp(1) | curses.A_BOLD)
            return
        q, opts, correct, expl = TRIVIA[self.order[self.i]]
        y = 2
        win.addstr(y, 3, f"Card {self.i + 1}/{len(TRIVIA)}   score {self.score}",
                   cp(4))
        y += 2
        for line in textwrap.wrap(q, w - 6):
            win.addstr(y, 3, line, curses.A_BOLD)
            y += 1
        y += 1
        for idx, opt in enumerate(opts):
            label = chr(ord('a') + idx)
            attr = 0
            if self.answered is not None:
                if idx == correct:
                    attr = cp(1) | curses.A_BOLD
                elif idx == self.answered:
                    attr = cp(2) | curses.A_BOLD
                else:
                    attr = cp(4)
            win.addstr(y, 5, f"{label}) {opt}"[:w - 8], attr)
            y += 1
        y += 1
        if self.answered is None:
            win.addstr(y, 3, "press a–d to answer", cp(4))
        else:
            verdict = "✓ correct" if self.answered == correct else "✗ nope"
            vc = cp(1) if self.answered == correct else cp(2)
            win.addstr(y, 3, verdict, vc | curses.A_BOLD)
            y += 1
            for line in textwrap.wrap(expl, w - 6):
                win.addstr(y, 3, line, cp(4))
                y += 1
            y += 1
            win.addstr(y, 3, "space → next card", cp(3))


class Crossword:
    name = "Crossword"
    # NATIVE across (row2), VIEW down (col4), crossing at the V.
    SOL = {
        (2, 0): "N", (2, 1): "A", (2, 2): "T", (2, 3): "I", (2, 4): "V",
        (2, 5): "E", (3, 4): "I", (4, 4): "E", (5, 4): "W",
    }
    CLUES = ["Across: React ___ (the framework target)",
             "Down: RN primitive that replaces <div>"]

    def __init__(self, h, w):
        self.reset()

    def reset(self):
        self.user = {k: "" for k in self.SOL}
        self.cells = sorted(self.SOL)
        self.cur = 0
        self.solved = False

    def _move(self, dr, dc):
        r, c = self.cells[self.cur]
        for step in range(1, 8):
            t = (r + dr * step, c + dc * step)
            if t in self.SOL:
                self.cur = self.cells.index(t)
                return

    def on_key(self, key):
        if self.solved:
            if key in (ord('r'), ord('R')):
                self.reset()
            return
        if key == curses.KEY_UP:
            self._move(-1, 0)
        elif key == curses.KEY_DOWN:
            self._move(1, 0)
        elif key == curses.KEY_LEFT:
            self._move(0, -1)
        elif key == curses.KEY_RIGHT:
            self._move(0, 1)
        elif key in (curses.KEY_BACKSPACE, 127, 8):
            self.user[self.cells[self.cur]] = ""
        elif 0 <= key < 256 and chr(key).isalpha():
            self.user[self.cells[self.cur]] = chr(key).upper()
            if self.cur < len(self.cells) - 1:
                self.cur += 1
            if all(self.user[k] == v for k, v in self.SOL.items()):
                self.solved = True

    def update(self, now):
        pass

    def render(self, win, h, w):
        win.box()
        title = " Mini Crossword "
        win.addstr(0, max(1, (w - len(title)) // 2), title[:w - 2], cp(5))
        oy, ox = 2, 4
        rows = range(0, 6)
        cols = range(0, 6)
        cur_cell = self.cells[self.cur]
        for r in rows:
            for c in cols:
                y, x = oy + r, ox + c * 4
                if x + 3 >= w:
                    continue
                if (r, c) in self.SOL:
                    ch = self.user[(r, c)] or " "
                    attr = curses.A_BOLD
                    if (r, c) == cur_cell and not self.solved:
                        attr |= curses.A_REVERSE
                    elif self.solved:
                        attr |= cp(1)
                    win.addstr(y, x, f"[{ch}]", attr)
        y = oy + 7
        for clue in self.CLUES:
            for line in textwrap.wrap(clue, w - 6):
                if y < h - 2:
                    win.addstr(y, 3, line, cp(4))
                    y += 1
        y += 1
        if self.solved:
            win.addstr(y, 3, "SOLVED! · r reset", cp(1) | curses.A_BOLD)
        else:
            win.addstr(y, 3, "arrows move · type letters · ⌫ clear", cp(3))


# ---------- left pane (dashboard + menu) ----------
def draw_left(win, h, w, games, active):
    win.erase()
    try:
        win.addstr(0, 1, "RN MIGRATION"[:w - 2], cp(5) | curses.A_BOLD)
        with _lock:
            rows = list(_dash["rows"])
            gates = list(_dash["gates"])
            ts = _dash["ts"]
        win.addstr(1, 1, f"{ts}  refresh 3s"[:w - 2], cp(4))
        win.addstr(3, 1, "Comp        P E V PR"[:w - 2], curses.A_BOLD)
        y = 4
        for r in rows:
            win.addstr(y, 1, r["name"][:11])
            x = 13
            for ph in ("plan", "execute", "verify"):
                ch, col = DOT[r[ph]]
                if x < w - 1:
                    win.addstr(y, x, ch, cp(col) | curses.A_BOLD)
                x += 2
            if x < w - 2:
                if r["pr"] == DONE:
                    win.addstr(y, x + 1, "✓", cp(1) | curses.A_BOLD)
                else:
                    win.addstr(y, x + 1, "—", cp(4))
            y += 1
        y += 1
        if gates:
            win.addstr(y, 1, "⚑ NEEDS YOU"[:w - 2], cp(2) | curses.A_BOLD)
            y += 1
            for g in gates:
                if y < h - 8:
                    win.addstr(y, 1, g[:w - 2], cp(3))
                    y += 1
        else:
            win.addstr(y, 1, "agents grinding"[:w - 2], cp(4))
            y += 1

        # ---- game menu ----
        y = max(y + 1, h - 8)
        win.addstr(y, 1, "─" * (w - 2), cp(4))
        y += 1
        win.addstr(y, 1, "GAMES", cp(5) | curses.A_BOLD)
        y += 1
        for i, g in enumerate(games):
            marker = "▶" if i == active else " "
            attr = curses.A_REVERSE | curses.A_BOLD if i == active else 0
            win.addstr(y, 1, f"{marker} {i + 1} {g.name}"[:w - 2], attr)
            y += 1
        win.addstr(h - 1, 1, "1/2/3 switch · q quit"[:w - 2], cp(4))
    except curses.error:
        pass
    win.noutrefresh()


def run(stdscr):
    curses.curs_set(0)
    stdscr.nodelay(True)
    stdscr.keypad(True)
    if curses.has_colors():
        curses.start_color()
        curses.use_default_colors()
        curses.init_pair(1, curses.COLOR_GREEN, -1)
        curses.init_pair(2, curses.COLOR_RED, -1)
        curses.init_pair(3, curses.COLOR_YELLOW, -1)
        curses.init_pair(4, 8, -1)
        curses.init_pair(5, curses.COLOR_CYAN, -1)

    sh_, sw = stdscr.getmaxyx()
    if sw < 60 or sh_ < 18:
        stdscr.addstr(0, 0, "Enlarge terminal to >= 60x18.")
        stdscr.getch()
        return

    left_w = 24
    div_x = left_w
    gx = left_w + 1
    gw = sw - gx
    gh = sh_

    left = curses.newwin(sh_, left_w, 0, 0)
    field = curses.newwin(gh, gw, 0, gx)

    games = [Snake(gh, gw), Trivia(gh, gw), Crossword(gh, gw)]
    active = 0

    while True:
        key = stdscr.getch()
        if key in (ord('q'), ord('Q')):
            break
        if key in (ord('1'), ord('2'), ord('3')):
            active = key - ord('1')
        elif key != -1:
            games[active].on_key(key)

        games[active].update(time.time())

        draw_left(left, sh_, left_w, games, active)
        for y in range(sh_):
            try:
                stdscr.addch(y, div_x, curses.ACS_VLINE, cp(4))
            except curses.error:
                pass
        stdscr.noutrefresh()

        field.erase()
        games[active].render(field, gh, gw)
        field.noutrefresh()
        curses.doupdate()
        time.sleep(0.02)


def main():
    threading.Thread(target=dash_worker, daemon=True).start()
    try:
        curses.wrapper(run)
    finally:
        _stop.set()


if __name__ == "__main__":
    main()
