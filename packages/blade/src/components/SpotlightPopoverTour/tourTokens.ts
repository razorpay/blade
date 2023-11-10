/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { modalHighestZIndex } from '~components/Modal/modalTokens';
import { motion } from '~tokens/global';

const transitionDelay = motion.duration.gentle;
const tourMaskZIndex = modalHighestZIndex + 100;

export { transitionDelay, tourMaskZIndex };
