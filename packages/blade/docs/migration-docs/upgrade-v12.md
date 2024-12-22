# Migration to Motion Presets (Blade v12)

## Changes

1. Token Structure for `motion.easing.*` tokens has changed

We've changed the structure of motion easing tokens inorder to simplify the structure and have limited set of variations

2. Motion React Setup

Blade v12 introduces `framer-motion` as peer dependency and requires you to set it up in your projects.

## Steps to Migrate

- **Step 1:** Upgrade to latest `@razorpay/blade` package in your project
- **Step 2:** [Perform Tokens Changes](#token-changes) using Codemod or manually
- **Step 3:** [Setup framer-motion](#motion-react-framer-motion-setup)

## Token Changes

We have codemod to help you do the required token changes. You can run the codemod with following command (Replace `./PATH_TO_YOUR_DIR` with glob path of files / directories you want to migrate)-

```sh
npx jscodeshift ./PATH_TO_YOUR_DIR --extensions=tsx,ts,jsx,js -t ./node_modules/@razorpay/blade/codemods/migrate-motion-tokens/transformers/index.ts --ignore-pattern="**/node_modules/**"
```

<details>
  <summary>Manual Migration</summary>

You can skip this if you've run the codemod but in case not or you see some edge cases, you can do manual migration by replacing the old tokens with equivalent new ones

| Old Token                              | Equivalent New Token           |
| -------------------------------------- | ------------------------------ |
| theme.motion.easing.entrance.effective | theme.motion.easing.entrance   |
| theme.motion.easing.standard.effective | theme.motion.easing.standard   |
| theme.motion.easing.exit.effective     | theme.motion.easing.exit       |
| theme.motion.easing.entrance.revealing | theme.motion.easing.entrance   |
| theme.motion.easing.standard.revealing | theme.motion.easing.emphasized |
| theme.motion.easing.exit.revealing     | theme.motion.easing.exit       |
| theme.motion.easing.entrance.attentive | theme.motion.easing.overshoot  |
| theme.motion.easing.exit.attentive     | theme.motion.easing.exit       |
| theme.motion.easing.standard.wary      | theme.motion.easing.shake      |

</details>

## Motion React (Framer Motion) Setup

> [!IMPORTANT]
>
> `framer-motion` library is now known as `motion/react`. We still use `framer-motion` imports in blade to support older versions.
>
> Checkout the [announcement by creator of framer-motion](https://bsky.app/profile/citizenofnowhe.re/post/3lar365ouuk2v)

### Version Compatibility for Consumers already using Framer Motion's Older Version

<details>
  <summary>Version Compatibility Note for consumers already using framer-motion with older version</summary>

We realised that several projects in razorpay are already using `framer-motion` and are on older versions.
To give some time to consumers to upgrade to framer-motion v11+, we'll be supporting framer-motion v4+ from blade. Although we will be dropping this support in next major version of blade so we recommend planning out framer-motion upgrade in coming quarter.

- **If you're on React 18**, migrating to framer-motion v11 should be fairly simple and low-effort. Checkout [Migrating from framer-motion v4+ to framer-motion v11+](#migrating-from-framer-motion-v4-to-framer-motion-v11)
- **For projects not on React 18 yet**, do plan out the upgrade soon to make sure future blade upgrades don't become blocker

#### Migrating from `framer-motion` v4+ to `framer-motion` v11+

1. Ensure you're on React 18 as `framer-motion` v7 makes React 18 a minimum supported version.
   a. [Checkout React 18 upgrade guide](https://react.dev/blog/2022/03/08/react-18-upgrade-guide) or use [React's official codemod for upgrading](https://github.com/reactjs/react-codemod)

2. `<AnimatePresence exitBeforeEnter>` -> `<AnimatePresence mode="wait">`

These are mostly the changes you'll need if you're using core API. But if you're extensively using any utilities / internal functions, checkout the full changelog of framer-motion here- https://motion.dev/docs/react-upgrade-guide

</details>

### Setting Up Motion in New Projects

- #### Install `framer-motion`

  ```sh
  yarn add framer-motion@^11 --dev # or pnpm install framer-motion --save-dev
  ```

- #### Setup reduced bundle version of `framer-motion`

  ##### If you're only using basic presets like `Fade`, `Move`, `Slide`, `Stagger`, `AnimateInteractions`, etc

  ```ts
  // features.js
  import { domAnimation } from 'framer-motion';
  export default domAnimation; // ~15kb
  ```

  ##### If you're using `Morph` or Layout animations of Motion React

  ```ts
  // features.js
  import { domMax } from 'framer-motion';
  export default domMax; // ~25kb (This includes domAnimation bundle as well so no need to import domAnimation again)
  ```

  ##### Lazy load into your App.js

  ```tsx
  import { LazyMotion, m } from 'framer-motion';

  // Make sure to return the specific export containing the feature bundle.
  const loadFeatures = () => import('./features.js').then((res) => res.default);

  function App() {
    return (
      // `strict` ensures that you only use `m` and not `motion` in your components
      // Blade presets always use `m` while animating
      <LazyMotion strict features={loadFeatures}>
        {/* The animations run when loadFeatures resolves. */}
        <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
      </LazyMotion>
    );
  }
  ```

  ##### Go ahead and enjoy the Blade Motion Presets

  ```ts
  import { Fade, Badge } from '@razorpay/blade/components';

  function MyComponent() {
    return (
      <Fade>
        <Badge color="positive">Motion Approved</Badge>
      </Fade>
    );
  }
  ```

---

Got stuck somewhere or have some doubts? reach out to `@blade-developers` on `#design-system` channel
