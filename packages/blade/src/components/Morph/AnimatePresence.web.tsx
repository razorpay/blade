// Web re-export of framer-motion's `AnimatePresence`.
// The native counterpart (`AnimatePresence.native.tsx`) is a passthrough so that
// `Morph.stories.tsx` can import a single `./AnimatePresence` module that resolves
// correctly on both platforms (framer-motion has no React Native build).
export { AnimatePresence } from 'framer-motion';
