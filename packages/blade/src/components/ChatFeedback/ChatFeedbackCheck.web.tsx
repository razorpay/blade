import React from 'react';
import styled, { keyframes } from 'styled-components';
import BaseBox from '~components/Box/BaseBox';
import { CheckIcon } from '~components/Icons';
import { castWebType } from '~utils';

/**
 * The mark the thank-you step ends on: a filled positive disc carrying a white check.
 *
 * ## Why a check and not a face or a star
 *
 * The step it closes is a rating — four faces the user just chose between. Answering that with a
 * fifth piece of expressive artwork puts them back in front of the control they have finished
 * with, and a celebratory illustration reads as the start of something rather than the end of it.
 * A check says the opposite: this is settled, nothing further is being asked.
 *
 * It also replaces a hand-authored gradient asset that was never a Blade icon — two ink colours
 * and a radial gradient, neither of which the single-colour icon contract supports, and a
 * `React.useId` for the gradient id that made the whole component unusable on React 17. Composing
 * a token-coloured disc around Blade's own `CheckIcon` costs none of that.
 *
 * ## The two sizes
 *
 * Blade ships `CheckCircleIcon`, but that is the outline form — a ring with a tick in it, which at
 * this size reads as one more control rather than as a result. The filled disc is the final one.
 *
 * 16px sits at about the cap height of the line beside it, so the mark reads as punctuation on
 * that sentence rather than competing with it; an earlier 20px disc was the loudest thing on a
 * strip whose whole job at that moment is to leave. The check is sized independently — Blade's
 * icon scale is xsmall 8, small 12, medium 16 — so `small` fills the disc to a 2px ring. At
 * `xsmall` the 8px tick floated in a green field and read as a dot: it is the ring, not the disc,
 * that makes it read as a check.
 */
const DISC_SIZE = { small: '16px', medium: '40px' } as const;
const ICON_SIZE = { small: 'small', medium: 'medium' } as const;

type ChatFeedbackCheckProps = {
  /** `small` sits inline beside one line of text; `medium` suits a panel of its own. */
  size?: keyof typeof DISC_SIZE;
};

/**
 * The one place on this strip where a little delight is affordable.
 *
 * Everything else here is seen on the way to something — the faces are a control, the chips are a
 * control, and motion on either would be motion in the user's way. This mark is terminal: it is
 * shown once, at the end, and the flow leaves a moment later. That is the whole delight budget,
 * so it is spent here and nowhere else.
 *
 * It starts at 0.9 rather than 0. Nothing in the world appears out of nothing, and a disc
 * inflating from a point reads as a spinner starting rather than as an answer landing. The
 * `overshoot` curve carries it a hair past its size and back, which is what makes it feel
 * stamped rather than faded in — small enough at a 0.1 delta to stay a confirmation, not a
 * celebration.
 */
const pop = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const Disc = styled(BaseBox)`
  animation: ${pop} ${({ theme }) => theme.motion.duration.quick}ms
    ${({ theme }) => castWebType(theme.motion.easing.overshoot)} both;

  /* The fade still says "this is new"; the scale is the part that only decorates. */
  @media (prefers-reduced-motion: reduce) {
    animation-name: none;
    opacity: 1;
  }
`;

const ChatFeedbackCheck = ({ size = 'small' }: ChatFeedbackCheckProps): React.ReactElement => (
  <Disc
    display="flex"
    alignItems="center"
    justifyContent="center"
    width={DISC_SIZE[size]}
    height={DISC_SIZE[size]}
    borderRadius="max"
    flexShrink={0}
    backgroundColor="feedback.background.positive.intense"
  >
    <CheckIcon size={ICON_SIZE[size]} color="surface.icon.staticWhite.subtle" />
  </Disc>
);

export { ChatFeedbackCheck };
export type { ChatFeedbackCheckProps };
