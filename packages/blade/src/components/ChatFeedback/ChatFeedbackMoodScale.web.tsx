import React from 'react';
import styled, { keyframes } from 'styled-components';
import type { ChatFeedbackMood, ChatFeedbackIcons } from './types';
import {
  chatFeedbackMoods,
  chatFeedbackMoodTokens,
  chatFeedbackMoodGlyphSize,
  chatFeedbackMoodButtonSize,
  chatFeedbackMoodDiscSize,
} from './chatFeedbackTokens';
import BaseBox from '~components/Box/BaseBox';
import { useTheme } from '~components/BladeProvider';
import { Tooltip } from '~components/Tooltip';
import { castWebType, makeSpace, makeSize } from '~utils';
import getIn from '~utils/lodashButBetter/get';

/** Gap between one face arriving and the next. Short enough that the row still reads as one beat. */
const MOOD_STAGGER_MS = 30;

const MoodButton = styled.button<{
  $activeColor: string;
  $activeSurface: string;
  $isSelected: boolean;
}>(({ theme, $activeColor, $activeSurface, $isSelected }) => {
  /*
   * Hover, keyboard focus and selection all resolve to one treatment: the mood's colour behind
   * the button, the mood's colour on the glyph, a slight lift, and — where Blade owns the artwork
   * — the filled face swapped in for the outline.
   *
   * The background is what makes this survive `feedbackIcons`. Every other cue acts on the glyph, and
   * a consumer-supplied one may be untintable and has no filled twin, so those cues quietly do
   * nothing; a 12% scale on its own is not enough to tell someone their rating registered.
   * Colouring the button reads the same whatever is drawn on top of it.
   */
  /*
   * The disc is drawn by a pseudo-element, not by the button's own background.
   *
   * The button is deliberately larger than the disc: it carries the tap target, which has to stay
   * at 44px, while the disc is a visual and reads better a little tighter around the glyph. Tying
   * the two together would mean trading one for the other — shrinking the target to shrink the
   * circle is the swap that put the adjacent-rating mis-taps back.
   */
  const activeState = {
    color: $activeColor,
    transform: 'scale(1.12)',
    '&::before': { opacity: 1 },
  };

  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    /*
     * A 44px box around a 28px glyph, butted against its neighbours, so the visible gap between
     * faces is the 16px of padding two adjacent buttons contribute.
     *
     * That padding is what keeps the row safe to aim at. An earlier 24px glyph left only 4px, so
     * a tap a couple of pixels wide of a face landed on its neighbour and silently recorded the
     * *adjacent* rating — on a four-point scale, "satisfied" becoming "dissatisfied" is a wrong
     * answer rather than a near miss. The padding is held at 8px as the glyph grows, which is why
     * the box grew with it rather than the faces being packed tighter.
     *
     * At 44px the target now meets the touch-target guidance it used to sit under. The row is
     * correspondingly taller, which is the cost of faces a merchant can actually read.
     */
    minWidth: makeSize(chatFeedbackMoodButtonSize),
    minHeight: makeSize(chatFeedbackMoodButtonSize),
    padding: makeSpace(theme.spacing[3]),
    border: 'none',
    backgroundColor: 'transparent',
    // Centred behind the glyph, revealed on hover, focus and selection.
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      width: makeSize(chatFeedbackMoodDiscSize),
      height: makeSize(chatFeedbackMoodDiscSize),
      borderRadius: makeSpace(theme.border.radius.max),
      backgroundColor: $activeSurface,
      opacity: 0,
      transition: `opacity ${theme.motion.duration.xquick}ms ${castWebType(
        theme.motion.easing.settle,
      )}`,
    },
    // The glyph sits above the disc.
    '& > *': { position: 'relative' },
    // Circular, so the surface reads as a halo around the glyph rather than as a chip.
    borderRadius: makeSpace(theme.border.radius.max),
    cursor: 'pointer',
    // Icons inherit this via `color="currentColor"`, so one declaration tints both layers.
    // Kept light at rest so the scale reads as an invitation rather than a set of filled
    // controls — legibility comes from the face shapes, not from stroke weight.
    color: getIn(theme.colors, 'surface.icon.gray.muted'),
    transform: 'scale(1)',
    transition: `transform ${theme.motion.duration.xquick}ms ${castWebType(
      theme.motion.easing.settle,
    )}, color ${theme.motion.duration.xquick}ms ${castWebType(
      theme.motion.easing.settle,
    )}, background-color ${theme.motion.duration.xquick}ms ${castWebType(
      theme.motion.easing.settle,
    )}`,

    '&:hover:not(:disabled)': activeState,
    '&:focus-visible': { ...activeState, outline: 'none' },
    ...($isSelected ? activeState : {}),

    /*
     * The press.
     *
     * Every other state on this button scales *up*, so without this a press had nowhere to go —
     * the face was already at 1.12 from the hover that necessarily preceded it, and clicking
     * changed nothing until the answer had been recorded. A dip back toward rest is the only
     * movement available, and it is the one that reads as a press.
     *
     * Deliberately last, so it wins over the hover, focus and selected rules above it, and
     * deliberately quicker than them: the user is waiting on this one, where the others merely
     * follow a pointer.
     */
    '&:active:not(:disabled)': {
      ...activeState,
      transform: 'scale(1.06)',
      transitionDuration: `${theme.motion.duration['2xquick']}ms`,
    },

    '&:disabled': {
      cursor: 'not-allowed',
      color: getIn(theme.colors, 'surface.icon.gray.disabled'),
    },
  };
});

type ChatFeedbackMoodScaleProps = {
  selectedMood: ChatFeedbackMood | null;
  isDisabled?: boolean;
  onSelect: (mood: ChatFeedbackMood) => void;
  feedbackIcons: ChatFeedbackIcons;
};

/**
 * Each face arrives a beat after the one before it.
 *
 * The strip already animates in, and the step inside it animates too, so this is a third layer
 * and had to earn its place. It does, because the four faces are the only part a merchant has to
 * choose between: arriving in sequence reads as a row being dealt, where arriving together reads
 * as a block appearing. 30ms is deliberately at the short end — the last face is settled inside
 * the beat the step itself occupies, so nothing waits on it.
 */
const enter = keyframes`
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

/**
 * Holds whatever a consumer supplies to the size Blade's own glyphs occupy.
 *
 * Without a box of its own, one oversized asset stretches the button, and the row's pitch goes
 * with it. Anything inside is hidden from assistive tech: the button already carries the mood's
 * name, and a decorative face announcing itself a second time is noise.
 *
 * The entrance lives here rather than on the button because the button's transform belongs to
 * hover — an animation there would hold its final keyframe and the hover would never move again.
 */
const MoodIconSlot = styled.span<{ $index: number }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /*
   * 28px, off the spacing scale, which stops at 24 and jumps to 32.
   *
   * A face is not an icon: an icon is one shape a merchant reads at a glance, while these carry
   * eyes, a mouth and — on two of them — a thumb, and every one of those has to survive the same
   * pass. At the 20px this slot used to be, the artwork inside its own box left the faces around
   * 15px and the tear a couple of pixels wide; four of them side by side read as coloured dots
   * rather than as expressions.
   */
  width: ${makeSize(chatFeedbackMoodGlyphSize)};
  height: ${makeSize(chatFeedbackMoodGlyphSize)};
  font-size: ${makeSize(chatFeedbackMoodGlyphSize)};
  line-height: 1;
  animation: ${enter} ${({ theme }) => theme.motion.duration.xquick}ms
    ${({ theme }) => castWebType(theme.motion.easing.entrance)}
    ${({ $index }) => $index * MOOD_STAGGER_MS}ms both;

  & > * {
    max-width: 100%;
    max-height: 100%;
  }

  /* Reduced motion keeps the fade, which explains the arrival, and drops the travel, which does not. */
  @media (prefers-reduced-motion: reduce) {
    animation-name: none;
    opacity: 1;
  }
`;

const ChatFeedbackMoodScale = ({
  selectedMood,
  isDisabled,
  onSelect,
  feedbackIcons,
}: ChatFeedbackMoodScaleProps): React.ReactElement => {
  const { theme } = useTheme();

  return (
    <BaseBox
      display="flex"
      flexDirection="row"
      alignItems="center"
      flexShrink={0}
      role="radiogroup"
      aria-label="Rate this experience"
    >
      {chatFeedbackMoods.map((mood, index) => {
        const { color, surfaceColor, label } = chatFeedbackMoodTokens[mood];
        const isSelected = selectedMood === mood;

        return (
          /*
           * The label is already the button's accessible name; the tooltip puts the same words
           * on screen. Four similar glyphs at 20px is exactly where a guess goes wrong, and here
           * a wrong guess records the wrong rating rather than merely costing a click.
           */
          <Tooltip key={mood} content={label} placement="top">
            <MoodButton
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={label}
              disabled={isDisabled}
              $isSelected={isSelected}
              $activeColor={getIn(theme.colors, color)}
              $activeSurface={getIn(theme.colors, surfaceColor)}
              onClick={() => onSelect(mood)}
            >
              {/*
                Rendered as given rather than adapted: what arrives may be an SVG, an emoji
                character or an image, and no single contract would let Blade tint or resize all
                three. The slot only bounds its size, and the button carries the selected state —
                which is why that state had to move off the glyph.
              */}
              <MoodIconSlot $index={index} aria-hidden="true">
                {feedbackIcons?.[mood]}
              </MoodIconSlot>
            </MoodButton>
          </Tooltip>
        );
      })}
    </BaseBox>
  );
};

export { ChatFeedbackMoodScale };
