import React from 'react';
import styled from 'styled-components';
import type { SliderInputProps } from './types';
import { SliderTrack } from './SliderTrack.web';
import { SliderValueIndicator } from './SliderValueIndicator.web';
import { useSliderInput } from './useSliderInput.web';
import {
  sliderInputColors,
  sliderInputMotion,
  SLIDER_BOX_HEIGHT,
  SLIDER_BOX_PADDING_TOP,
  SLIDER_CONTROL_HEIGHT,
  SLIDER_SCALE_TOP,
  SLIDER_THUMB_HIT_AREA,
  SLIDER_THUMB_SIZE,
  SLIDER_THUMB_TOP,
  SLIDER_TRACK_TOP,
} from './sliderInputTokens';
import {
  getCenteringTransform,
  getMarkerValues,
  getMinTrackWidth,
  getOffsetExpression,
  getSpacedScaleValues,
  getValueRatio,
  getVisibility,
  getWidestLabelWidth,
} from './utils';
import BaseBox from '~components/Box/BaseBox';
import { FormLabel, FormHint } from '~components/Form';
import { useFormId } from '~components/Form/useFormId';
import { getHintType } from '~components/Input/BaseInput/BaseInput';
import { Text } from '~components/Typography';
import { useTheme } from '~components/BladeProvider';
import type { Theme } from '~components/BladeProvider';
import { useBreakpoint, makeSize, makeMotionTime } from '~utils';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import { getOuterMotionRef } from '~utils/getMotionRefs';
import type { BladeElementRef } from '~utils/types';
import get from '~utils/lodashButBetter/get';

/**
 * The scale hangs 4px below the box on purpose. The box itself stays exactly one small
 * BaseInput tall so that toggling the scale never moves the track, and a SliderInput keeps
 * sharing a field centre line with the TextInput it is paired with.
 */
const FieldBox = styled.div<{ $hasScale: boolean }>`
  position: relative;
  width: 100%;
  height: ${makeSize(SLIDER_BOX_HEIGHT)};
  margin-bottom: ${({ $hasScale }) =>
    $hasScale ? makeSize(SLIDER_SCALE_TOP + 12 - SLIDER_BOX_HEIGHT) : '0px'};
`;

const Control = styled.div<{ $isDisabled: boolean }>`
  position: absolute;
  inset-inline: 0;
  top: ${makeSize(SLIDER_BOX_PADDING_TOP)};
  height: ${makeSize(SLIDER_CONTROL_HEIGHT)};
  cursor: ${({ $isDisabled }) => ($isDisabled ? 'not-allowed' : 'pointer')};
  /* Horizontal drags belong to the slider; without this the browser scrolls the page instead. */
  touch-action: none;

  /* Lifts the target to the 44px minimum without touching the visual height. */
  &::before {
    content: '';
    position: absolute;
    inset-inline: 0;
    top: ${makeSize(-(SLIDER_THUMB_HIT_AREA - SLIDER_CONTROL_HEIGHT) / 2)};
    bottom: ${makeSize(-(SLIDER_THUMB_HIT_AREA - SLIDER_CONTROL_HEIGHT) / 2)};
  }
`;

const TrackArea = styled.div`
  position: absolute;
  inset-inline: 0;
  top: ${makeSize(SLIDER_TRACK_TOP - SLIDER_BOX_PADDING_TOP)};
`;

/**
 * Movement is eased so a keyboard step, or a click further down the track, reads as the thumb
 * travelling rather than teleporting. It is suppressed only while scrubbing, where the thumb
 * has to stay pinned to the pointer.
 */
const getThumbTransition = (theme: Theme, isScrubbing: boolean): string => {
  const easing = String(theme.motion.easing[sliderInputMotion.position.easing]);
  const color = `background-color ${makeMotionTime(
    theme.motion.duration[sliderInputMotion.color.duration],
  )} ${easing}`;
  if (isScrubbing) return color;
  const move = `inset-inline-start ${makeMotionTime(
    theme.motion.duration[sliderInputMotion.position.duration],
  )} ${easing}`;
  return `${move}, ${color}`;
};

const Thumb = styled.div<{ $color: string; $isScrubbing: boolean }>`
  position: absolute;
  top: ${makeSize(SLIDER_THUMB_TOP)};
  width: ${makeSize(SLIDER_THUMB_SIZE)};
  height: ${makeSize(SLIDER_THUMB_SIZE)};
  border-radius: ${({ theme }) => makeSize(theme.border.radius.max)};
  background-color: ${({ $color }) => $color};
  outline: none;
  transition: ${({ theme, $isScrubbing }) => getThumbTransition(theme, $isScrubbing)};

  &:focus-visible {
    ${({ theme }) => getFocusRingStyles({ theme, variant: 'neutral' })}
    /*
     * getFocusRingStyles narrows transition-property to outline-width alone, which would
     * freeze the thumb in place exactly while the keyboard is driving it. Re-declare the
     * movement alongside the ring's own growth.
     */
    transition: ${({ theme, $isScrubbing }) =>
      `outline-width ${makeMotionTime(theme.motion.duration['2xquick'])} ${String(
        theme.motion.easing.standard,
      )}, ${getThumbTransition(theme, $isScrubbing)}`};
  }
`;

const ScaleRow = styled.div`
  position: absolute;
  inset-inline: 0;
  top: ${makeSize(SLIDER_SCALE_TOP)};
  /* The labels sit over the bottom of the control, so they must not swallow drags. */
  pointer-events: none;
`;

const ScaleLabel = styled.div`
  position: absolute;
  white-space: nowrap;
`;

const _SliderInput = (
  {
    label,
    labelPosition = 'top',
    necessityIndicator,
    accessibilityLabel,
    helpText,
    errorText,
    successText,
    validationState = 'none',
    value,
    defaultValue,
    onChange,
    onChangeEnd,
    onFocus,
    onBlur,
    min = 0,
    max = 100,
    step = 1,
    showMarkers = false,
    showScale = false,
    showScaleValues = true,
    showValueIndicator = true,
    formatValue,
    isDisabled = false,
    isRequired = false,
    name,
    testID,
    _motionMeta,
    ...rest
  }: SliderInputProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({ breakpoints: theme.breakpoints });
  const isLabelLeftPositioned = labelPosition === 'left' && matchedDeviceType === 'desktop';

  const { inputId, labelId, helpTextId, errorTextId, successTextId } = useFormId('slider-input');

  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  // Every handler in the hook depends on this, so a fresh object each render would rebuild
  // all of them on every pointer move.
  const range = React.useMemo(() => ({ min, max, step }), [min, max, step]);

  const {
    value: currentValue,
    trackAreaRef,
    thumbRef,
    trackWidth,
    isRTL,
    isDragging,
    isScrubbing,
    controlProps,
    thumbProps,
  } = useSliderInput({ value, defaultValue, onChange, onChangeEnd, range, isDisabled });

  const markerValues = React.useMemo(() => getMarkerValues(range), [range]);
  const markerRatios = React.useMemo(
    () => markerValues.map((markerValue) => getValueRatio(markerValue, range)),
    [markerValues, range],
  );

  const format = React.useCallback(
    (target: number): string => (formatValue ? formatValue(target) : String(target)),
    [formatValue],
  );

  const widestLabelWidth = React.useMemo(() => getWidestLabelWidth(markerValues, formatValue), [
    markerValues,
    formatValue,
  ]);

  const { canShowMarkers, canShowScale } = getVisibility({
    trackWidth,
    markerCount: markerValues.length,
    widestLabelWidth,
  });

  const shouldShowMarkers = showMarkers && canShowMarkers;
  // With only the endpoints there is nothing to collide with, so the pitch floor does not apply.
  const shouldShowScale = showScale && (!showScaleValues || canShowScale);
  const scaleValues = React.useMemo(
    () =>
      showScaleValues
        ? getSpacedScaleValues({ values: markerValues, trackWidth, widestLabelWidth, range })
        : [min, max],
    [showScaleValues, markerValues, trackWidth, widestLabelWidth, range, min, max],
  );

  const centeringTransform = getCenteringTransform(isRTL);
  const thumbOffset = getOffsetExpression(getValueRatio(currentValue, range));
  const isHighlighted = isHovered || isFocused || isDragging;

  const willRenderHintText =
    Boolean(helpText) ||
    (validationState === 'success' && Boolean(successText)) ||
    (validationState === 'error' && Boolean(errorText));

  const describedBy =
    validationState === 'error'
      ? errorTextId
      : validationState === 'success'
      ? successTextId
      : helpText
      ? helpTextId
      : undefined;

  const thumbColor = isDisabled
    ? sliderInputColors.fill.disabled
    : isHighlighted
    ? sliderInputColors.fill.highlighted
    : sliderInputColors.fill.default;

  return (
    <BaseBox
      ref={getOuterMotionRef({ _motionMeta, ref })}
      {...metaAttribute({ name: MetaConstants.SliderInput, testID })}
      {...getStyledProps(rest)}
      {...makeAnalyticsAttribute(rest)}
    >
      <BaseBox
        display="flex"
        flexDirection={isLabelLeftPositioned ? 'row' : 'column'}
        alignItems={isLabelLeftPositioned ? 'center' : undefined}
      >
        {label ? (
          // A `<label for>` cannot target a div, so the association is made with
          // `aria-labelledby` on the thumb instead.
          <FormLabel
            as="span"
            id={labelId}
            position={labelPosition}
            necessityIndicator={necessityIndicator ?? (isRequired ? 'required' : undefined)}
          >
            {label}
          </FormLabel>
        ) : null}

        <BaseBox
          flex="1"
          // Labels only widen the floor when they are actually on screen.
          minWidth={makeSize(
            getMinTrackWidth(
              markerValues.length,
              showScale && showScaleValues ? widestLabelWidth : 0,
            ),
          )}
        >
          <FieldBox $hasScale={shouldShowScale}>
            <Control
              $isDisabled={isDisabled}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              {...controlProps}
            >
              <TrackArea ref={trackAreaRef}>
                <SliderTrack
                  value={currentValue}
                  range={range}
                  markerRatios={shouldShowMarkers ? markerRatios : []}
                  isDisabled={isDisabled}
                  isHighlighted={isHighlighted}
                  isScrubbing={isScrubbing}
                  isRTL={isRTL}
                />
              </TrackArea>

              <Thumb
                ref={thumbRef}
                $color={get(theme.colors, thumbColor)}
                $isScrubbing={isScrubbing}
                style={{ insetInlineStart: thumbOffset, transform: centeringTransform }}
                role="slider"
                tabIndex={isDisabled ? -1 : 0}
                id={inputId}
                aria-orientation="horizontal"
                aria-valuemin={min}
                aria-valuemax={max}
                // Always the snapped value, so the announcement matches the marker the thumb
                // is standing on rather than whatever was passed in.
                aria-valuenow={currentValue}
                aria-valuetext={format(currentValue)}
                aria-labelledby={label ? labelId : undefined}
                aria-label={label ? undefined : accessibilityLabel}
                aria-describedby={describedBy}
                aria-disabled={isDisabled}
                // No `aria-required`: it is not a supported attribute on `role="slider"`,
                // which always holds a value. `isRequired` shows on the label instead.
                onFocus={() => {
                  setIsFocused(true);
                  onFocus?.({ name, value: String(currentValue) });
                }}
                onBlur={() => {
                  setIsFocused(false);
                  onBlur?.({ name, value: String(currentValue) });
                }}
                {...thumbProps}
              />

              {/* After the thumb so it paints above it rather than under. */}
              {showValueIndicator ? (
                <SliderValueIndicator
                  offset={thumbOffset}
                  centeringTransform={centeringTransform}
                  isVisible={isHighlighted && !isDisabled}
                  isScrubbing={isScrubbing}
                  value={currentValue}
                >
                  {format(currentValue)}
                </SliderValueIndicator>
              ) : null}
            </Control>

            {shouldShowScale ? (
              <ScaleRow aria-hidden={true}>
                {scaleValues.map((scaleValue) => (
                  <ScaleLabel
                    key={scaleValue}
                    style={{
                      insetInlineStart: getOffsetExpression(getValueRatio(scaleValue, range)),
                      transform: centeringTransform,
                    }}
                  >
                    <Text
                      size="xsmall"
                      weight="regular"
                      color={
                        isDisabled
                          ? sliderInputColors.scaleLabel.disabled
                          : sliderInputColors.scaleLabel.default
                      }
                    >
                      {format(scaleValue)}
                    </Text>
                  </ScaleLabel>
                ))}
              </ScaleRow>
            ) : null}
          </FieldBox>

          {name ? <input type="hidden" name={name} value={currentValue} readOnly={true} /> : null}

          {willRenderHintText ? (
            <FormHint
              type={getHintType({ validationState, hasHelpText: Boolean(helpText) })}
              helpText={helpText}
              errorText={errorText}
              successText={successText}
              helpTextId={helpTextId}
              errorTextId={errorTextId}
              successTextId={successTextId}
            />
          ) : null}
        </BaseBox>
      </BaseBox>
    </BaseBox>
  );
};

const SliderInput = assignWithoutSideEffects(React.forwardRef(_SliderInput), {
  componentId: MetaConstants.SliderInput,
  displayName: 'SliderInput',
});

export { SliderInput };
