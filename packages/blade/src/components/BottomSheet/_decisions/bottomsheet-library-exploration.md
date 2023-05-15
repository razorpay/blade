## Bottom Sheet Library Exploration

**Web:**

**react-spring-bottom-sheet**

github: [https://github.com/stipsan/react-spring-bottom-sheet](https://github.com/stipsan/react-spring-bottom-sheet)

Pros:

- Feature Rich, snapping points, fixed headers etc
- Handles Gestures
- Handles Animations
- Comes with minimal set of CSS which which [can be customized](https://github.com/stipsan/react-spring-bottom-sheet#customizing-the-css)

Cons:

- Bundle size is 44kb
- Peer dependency on react-spring (20kb)
- Peer depdendncy on xstate/xtate-react (~20kb 🤦)
- Animations/duration [can’t be modified](https://github.com/stipsan/react-spring-bottom-sheet/issues/151#issuecomment-1368631716)

Sandbox Demo: [https://codesandbox.io/s/relaxed-dawn-ohyi9r?file=/src/App.tsx](https://codesandbox.io/s/relaxed-dawn-ohyi9r?file=/src/App.tsx)

**react-bottom-drawer**

github: **[https://github.com/fpellicero/react-bottom-drawer](https://github.com/fpellicero/react-bottom-drawer)**

Pros:

- Very small (30kb minifized, 10kb gzipped)
- Comes with minimal CSS which can be customized

Cons:

- Not maintained yet, very old
- Not very feature rich, no snapping points / fixed height
- No basic a11y support, initialFocusRef, return focus to trigger etc
- Animations/duration can’t be modified (uses react-transition-group)

Sandbox Demo: [https://codesandbox.io/s/blade-exploration-react-bottom-drawer-bpiq5q](https://codesandbox.io/s/blade-exploration-react-bottom-drawer-bpiq5q)

react-animated-bottomsheet

github: [https://github.com/morfsys/react-animated-bottomsheet](https://github.com/morfsys/react-animated-bottomsheet)

Pros:

- None

Cons:

- All the above cons 😆 plus…
- No TS Support
- User needs to add the portal `<div id=”bottomsheet”>` on their html

[https://github.com/morfsys/react-animated-bottomsheet](https://github.com/morfsys/react-animated-bottomsheet)

[https://github.com/stipsan/react-spring-bottom-sheet](https://github.com/stipsan/react-spring-bottom-sheet)

[https://github.com/bottom-sheet/react-hooks](https://github.com/bottom-sheet/react-hooks)

1. Fork / Custom Implementation
2. Explore other DS

**Native**

[https://github.com/rgommezz/react-native-scroll-bottom-sheet](https://github.com/rgommezz/react-native-scroll-bottom-sheet)

[https://www.reddit.com/r/reactnative/comments/hh5s8h/best_rn_bottom_sheetmodal/](https://www.reddit.com/r/reactnative/comments/hh5s8h/best_rn_bottom_sheetmodal/)

[https://github.com/osdnk/react-native-reanimated-bottom-sheet](https://github.com/osdnk/react-native-reanimated-bottom-sheet)

[https://github.com/jeremybarbet/react-native-modalize](https://github.com/jeremybarbet/react-native-modalize)


> This file is cloned from: https://docs.google.com/document/d/1lRIBo5nkp1R9_DC9nRiFFwBEH3oVhMZjLbV7jxFrYBA/edit
