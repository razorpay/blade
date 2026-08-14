import React from 'react';
import styled from 'styled-components';
import type { ChatFeedbackMood, ChatFeedbackMoodIcons } from './types';
import { chatFeedbackMoods, chatFeedbackMoodTokens } from './chatFeedbackTokens';
import BaseBox from '~components/Box/BaseBox';
import { useTheme } from '~components/BladeProvider';
import { Tooltip } from '~components/Tooltip';
import { castWebType, makeSpace } from '~utils';
import getIn from '~utils/lodashButBetter/get';

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
   * The background is what makes this survive `moodIcons`. Every other cue acts on the glyph, and
   * a consumer-supplied one may be untintable and has no filled twin, so those cues quietly do
   * nothing; a 12% scale on its own is not enough to tell someone their rating registered.
   * Colouring the button reads the same whatever is drawn on top of it.
   */
  const activeState = {
    color: $activeColor,
    backgroundColor: $activeSurface,
    transform: 'scale(1.12)',
  };

  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    /*
     * A 32px box around a 20px glyph, butted against its neighbours: 20 + 12 is exactly the
     * 32px pitch the design specifies, so the visible gap between faces comes out at 12px while
     * each target stays a full 32px.
     *
     * The 6px of padding on every side is what makes that safe. An earlier 24px glyph left only
     * 4px, so a tap a couple of pixels wide of a face landed on its neighbour and silently
     * recorded the *adjacent* rating — on a four-point scale, "satisfied" becoming
     * "dissatisfied" is a wrong answer rather than a near miss. The smaller glyph widens the
     * margin for error without moving anything.
     *
     * The box still sits below the 44px touch-target guidance: the row has to stay shallow
     * enough to sit above a composer without dominating it.
     */
    minWidth: makeSpace(theme.spacing[8]),
    minHeight: makeSpace(theme.spacing[8]),
    padding: makeSpace(theme.spacing[3]),
    border: 'none',
    backgroundColor: 'transparent',
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
  moodIcons: ChatFeedbackMoodIcons;
};

/**
 * Holds whatever a consumer supplies to the size Blade's own glyphs occupy.
 *
 * Without a box of its own, one oversized asset stretches the button, and the 32px pitch the row
 * is built on goes with it. Anything inside is hidden from assistive tech: the button already
 * carries the mood's name, and a decorative face announcing itself a second time is noise.
 */
const MoodIconSlot = styled.span(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: makeSpace(theme.spacing[6]),
  height: makeSpace(theme.spacing[6]),
  fontSize: makeSpace(theme.spacing[6]),
  lineHeight: 1,
  '& > *': { maxWidth: '100%', maxHeight: '100%' },
}));

const ChatFeedbackMoodScale = ({
  selectedMood,
  isDisabled,
  onSelect,
  moodIcons,
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
      {chatFeedbackMoods.map((mood) => {
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
              <MoodIconSlot aria-hidden="true">{moodIcons[mood]}</MoodIconSlot>
            </MoodButton>
          </Tooltip>
        );
      })}
    </BaseBox>
  );
};

export { ChatFeedbackMoodScale };
