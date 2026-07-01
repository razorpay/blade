#!/usr/bin/env python3
"""Terminal snake. Arrows/WASD to move, Q to quit. For killing time during migration gates."""
import curses
import random
import time


def main(stdscr):
    curses.curs_set(0)
    stdscr.nodelay(True)
    stdscr.keypad(True)

    if curses.has_colors():
        curses.start_color()
        curses.use_default_colors()
        curses.init_pair(1, curses.COLOR_GREEN, -1)
        curses.init_pair(2, curses.COLOR_RED, -1)
        curses.init_pair(3, curses.COLOR_CYAN, -1)

    sh, sw = stdscr.getmaxyx()
    h = min(sh - 2, 24)
    w = min(sw - 2, 60)
    win = curses.newwin(h, w, 0, 0)
    win.keypad(True)
    win.nodelay(True)

    snake = [(h // 2, w // 4), (h // 2, w // 4 - 1), (h // 2, w // 4 - 2)]
    food = (h // 2, w // 2)
    direction = curses.KEY_RIGHT
    score = 0
    tick = 0.12

    key_map = {
        ord('w'): curses.KEY_UP, ord('s'): curses.KEY_DOWN,
        ord('a'): curses.KEY_LEFT, ord('d'): curses.KEY_RIGHT,
    }
    opposite = {
        curses.KEY_UP: curses.KEY_DOWN, curses.KEY_DOWN: curses.KEY_UP,
        curses.KEY_LEFT: curses.KEY_RIGHT, curses.KEY_RIGHT: curses.KEY_LEFT,
    }

    def draw():
        win.erase()
        win.box()
        fc = curses.color_pair(2) if curses.has_colors() else 0
        win.addch(food[0], food[1], ord('@'), fc)
        for i, (y, x) in enumerate(snake):
            ch = ord('O') if i == 0 else ord('o')
            sc = curses.color_pair(1) if curses.has_colors() else 0
            win.addch(y, x, ch, sc)
        label = f" snake  score:{score}  (q to quit) "
        tc = curses.color_pair(3) if curses.has_colors() else 0
        win.addstr(0, max(1, (w - len(label)) // 2), label[:w - 2], tc)
        win.refresh()

    draw()
    while True:
        key = win.getch()
        if key in (ord('q'), ord('Q')):
            break
        if key in key_map:
            key = key_map[key]
        if key in (curses.KEY_UP, curses.KEY_DOWN, curses.KEY_LEFT, curses.KEY_RIGHT):
            if key != opposite.get(direction):
                direction = key

        hy, hx = snake[0]
        if direction == curses.KEY_UP:
            hy -= 1
        elif direction == curses.KEY_DOWN:
            hy += 1
        elif direction == curses.KEY_LEFT:
            hx -= 1
        elif direction == curses.KEY_RIGHT:
            hx += 1
        head = (hy, hx)

        if hy <= 0 or hy >= h - 1 or hx <= 0 or hx >= w - 1 or head in snake:
            break

        snake.insert(0, head)
        if head == food:
            score += 1
            tick = max(0.05, tick - 0.004)
            while True:
                food = (random.randint(1, h - 2), random.randint(1, w - 2))
                if food not in snake:
                    break
        else:
            snake.pop()

        draw()
        time.sleep(tick)

    win.nodelay(False)
    msg = f" game over  score:{score}  press any key "
    try:
        win.addstr(h // 2, max(1, (w - len(msg)) // 2), msg[:w - 2],
                   curses.color_pair(2) if curses.has_colors() else 0)
        win.refresh()
        win.getch()
    except curses.error:
        pass


if __name__ == "__main__":
    curses.wrapper(main)
