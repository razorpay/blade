/* eslint-disable @typescript-eslint/restrict-plus-operands */
import type { StepItemProps } from './types';
import { StepItemIndicator } from './StepItemMarker';
import { useStepGroup } from './StepGroupContext';
import {
  getMarkerLineSpacings,
  itemTopMargin,
  markerLineDotSpacing,
  markerLineDotWidth,
  markerLineWidth,
} from './tokens';
import { Box } from '~components/Box';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import BaseBox from '~components/Box/BaseBox';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import Svg, { Path } from '~components/Icons/_Svg';
import { makeSize, useTheme } from '~utils';

type StepLineSvgProps = {
  isDotted?: boolean;
} & StyledPropsBlade;

const useDottedLineStyles = ({ isHorizontal }: { isHorizontal?: boolean } = {}): BaseBoxProps => {
  const { theme } = useTheme();

  const svgString = `<svg width="2" height="2" viewBox="0 0 2 2" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0 1C0 0.447715 0.447715 0 1 0C1.55228 0 2 0.447715 2 1C2 1.55228 1.55228 2 1 2C0.447715 2 0 1.55228 0 1Z"
      fill="${theme.colors.surface.border.gray.subtle}"
    />
  </svg>
  `;

  const backgroundURL = `url(data:image/svg+xml;base64,${window.btoa(svgString)})`;

  return {
    backgroundImage: backgroundURL,
    backgroundPosition: isHorizontal ? 'left' : 'top',
    backgroundSize: isHorizontal
      ? `${makeSize(markerLineDotWidth + markerLineDotSpacing)} ${makeSize(markerLineDotWidth)}`
      : `${makeSize(markerLineDotWidth)} ${makeSize(markerLineDotWidth + markerLineDotSpacing)} `,
    backgroundRepeat: isHorizontal ? 'round no-repeat' : 'no-repeat round',
  };
};

const StepStraightLineHorizontal = ({
  isDotted,
  width,
  ...styledProps
}: StepLineSvgProps & {
  width?: number;
}): React.ReactElement => {
  const dottedStyles = useDottedLineStyles({ isHorizontal: true });
  const borderStyles: BaseBoxProps = isDotted
    ? dottedStyles
    : {
        borderTopWidth: 'thicker',
        borderTopColor: 'surface.border.gray.subtle',
      };

  return <BaseBox height={makeSize(markerLineWidth)} flex="1" {...borderStyles} {...styledProps} />;
};

const StepStraightLineVertical = ({
  height,
  isDotted,
  ...styledProps
}: StepLineSvgProps & {
  height?: number;
}): React.ReactElement => {
  const dottedStyles = useDottedLineStyles();
  const borderStyles: BaseBoxProps = isDotted
    ? dottedStyles
    : {
        borderLeftWidth: 'thicker',
        borderLeftColor: 'surface.border.gray.subtle',
      };
  return (
    <BaseBox
      height={height ? makeSize(height) : undefined}
      flex={height ? undefined : '1'}
      width={makeSize(markerLineWidth)}
      {...borderStyles}
      {...styledProps}
    />
  );
};

const StepTopCurveVertical = ({
  isDotted,
  ...styledProps
}: StepLineSvgProps): React.ReactElement => {
  const { theme } = useTheme();
  return isDotted ? (
    <Svg
      width="21"
      height="15"
      marginLeft="-1px"
      viewBox="0 0 21 15"
      fill={theme.colors.surface.border.gray.subtle}
    >
      <Path d="M1.90332 2.3916C2.20752 2.3916 2.47998 2.25586 2.66357 2.04199C2.81299 1.86719 2.90332 1.63965 2.90332 1.3916C2.90332 0.838867 2.45557 0.391602 1.90332 0.391602C1.35107 0.391602 0.90332 0.838867 0.90332 1.3916C0.90332 1.94434 1.35107 2.3916 1.90332 2.3916Z" />
      <Path d="M9.85352 13.042C9.66992 13.2559 9.39746 13.3916 9.09326 13.3916C8.54102 13.3916 8.09326 12.9443 8.09326 12.3916C8.09326 11.8389 8.54102 11.3916 9.09326 11.3916C9.64551 11.3916 10.0933 11.8389 10.0933 12.3916C10.0933 12.6396 10.0029 12.8672 9.85352 13.042Z" />
      <Path d="M14.498 14.3916C14.8022 14.3916 15.0747 14.2559 15.2583 14.042C15.4077 13.8672 15.498 13.6396 15.498 13.3916C15.498 12.8389 15.0503 12.3916 14.498 12.3916C13.9458 12.3916 13.498 12.8389 13.498 13.3916C13.498 13.9443 13.9458 14.3916 14.498 14.3916Z" />
      <Path d="M19.9033 14.3916C20.2075 14.3916 20.48 14.2559 20.6636 14.042C20.813 13.8672 20.9033 13.6396 20.9033 13.3916C20.9033 12.8389 20.4556 12.3916 19.9033 12.3916C19.3511 12.3916 18.9033 12.8389 18.9033 13.3916C18.9033 13.9443 19.3511 14.3916 19.9033 14.3916Z" />
      <Path d="M3.26318 6.08887C3.07959 6.30273 2.80713 6.43848 2.50293 6.43848C1.95068 6.43848 1.50293 5.99121 1.50293 5.43848C1.50293 4.88574 1.95068 4.43848 2.50293 4.43848C3.05518 4.43848 3.50293 4.88574 3.50293 5.43848C3.50293 5.68652 3.4126 5.91406 3.26318 6.08887Z" />
      <Path d="M5.15137 10.6357C5.45557 10.6357 5.72803 10.5 5.91162 10.2861C6.06104 10.1113 6.15137 9.88379 6.15137 9.63574C6.15137 9.08301 5.70361 8.63574 5.15137 8.63574C4.59912 8.63574 4.15137 9.08301 4.15137 9.63574C4.15137 10.1885 4.59912 10.6357 5.15137 10.6357Z" />
    </Svg>
  ) : (
    <Svg width="20" height="14" viewBox="0 0 20 14" fill="none" {...styledProps}>
      <Path
        d="M1 0V1C1 7.62742 6.37258 13 13 13H20"
        stroke={theme.colors.surface.border.gray.subtle}
        strokeWidth="2"
      />
    </Svg>
  );
};

const StepBottomCurveVertical = ({
  isDotted,
  ...styledProps
}: StepLineSvgProps): React.ReactElement => {
  const { theme } = useTheme();

  return isDotted ? (
    <Svg width="35" height="26" viewBox="0 0 35 26" fill={theme.colors.surface.border.gray.subtle}>
      <Path d="M34.7603 1.93457C34.5767 2.14844 34.3042 2.28418 34 2.28418C33.4478 2.28418 33 1.83691 33 1.28418C33 0.731445 33.4478 0.28418 34 0.28418C34.5522 0.28418 35 0.731445 35 1.28418C35 1.53223 34.9097 1.75977 34.7603 1.93457Z" />
      <Path d="M2 18.7803C2.3042 18.7803 2.57666 18.6445 2.76025 18.4307C2.90967 18.2559 3 18.0283 3 17.7803C3 17.2275 2.55225 16.7803 2 16.7803C1.44775 16.7803 1 17.2275 1 17.7803C1 18.333 1.44775 18.7803 2 18.7803Z" />
      <Path d="M1 25.2842C1.3042 25.2842 1.57666 25.1484 1.76025 24.9346C1.90967 24.7598 2 24.5322 2 24.2842C2 23.7314 1.55225 23.2842 1 23.2842C0.447754 23.2842 0 23.7314 0 24.2842C0 24.8369 0.447754 25.2842 1 25.2842Z" />
      <Path d="M7.30127 14.7842C7.60547 14.7842 7.87793 14.6484 8.06152 14.4346C8.21094 14.2598 8.30127 14.0322 8.30127 13.7842C8.30127 13.2314 7.85352 12.7842 7.30127 12.7842C6.74902 12.7842 6.30127 13.2314 6.30127 13.7842C6.30127 14.3369 6.74902 14.7842 7.30127 14.7842Z" />
      <Path d="M14.7188 13.1338C14.5352 13.3477 14.2627 13.4834 13.9585 13.4834C13.4062 13.4834 12.9585 13.0361 12.9585 12.4834C12.9585 11.9307 13.4062 11.4834 13.9585 11.4834C14.5107 11.4834 14.9585 11.9307 14.9585 12.4834C14.9585 12.7314 14.8682 12.959 14.7188 13.1338Z" />
      <Path d="M20.5698 12.2119C20.874 12.2119 21.1465 12.0762 21.3301 11.8623C21.4795 11.6875 21.5698 11.46 21.5698 11.2119C21.5698 10.6592 21.1221 10.2119 20.5698 10.2119C20.0176 10.2119 19.5698 10.6592 19.5698 11.2119C19.5698 11.7646 20.0176 12.2119 20.5698 12.2119Z" />
      <Path d="M27.6211 10.6523C27.4375 10.8662 27.165 11.002 26.8608 11.002C26.3086 11.002 25.8608 10.5547 25.8608 10.002C25.8608 9.44922 26.3086 9.00195 26.8608 9.00195C27.4131 9.00195 27.8608 9.44922 27.8608 10.002C27.8608 10.25 27.7705 10.4775 27.6211 10.6523Z" />
      <Path d="M32.0879 8.2002C32.3921 8.2002 32.6646 8.06445 32.8481 7.85059C32.9976 7.67578 33.0879 7.44824 33.0879 7.2002C33.0879 6.64746 32.6401 6.2002 32.0879 6.2002C31.5356 6.2002 31.0879 6.64746 31.0879 7.2002C31.0879 7.75293 31.5356 8.2002 32.0879 8.2002Z" />
    </Svg>
  ) : (
    <Svg width="35" height="25" viewBox="0 0 35 25" fill="none" {...styledProps}>
      <Path
        d="M1 25V21.3088C1 17.4754 3.71928 14.1808 7.48316 13.4539L27.5168 9.58528C31.2807 8.85845 34 5.56381 34 1.7304V-2.98023e-08"
        stroke={theme.colors.surface.border.gray.subtle}
        strokeWidth="2"
      />
    </Svg>
  );
};

type StepLineProps = {
  stepType: 'single-item' | 'start' | 'middle' | 'end' | 'default';
  shouldShowStartBranch: boolean;
  shouldShowEndBranch: boolean;
} & Pick<StepItemProps, 'stepProgress' | 'marker'>;

type StepLineSubComponentProps = Pick<
  StepLineProps,
  'shouldShowStartBranch' | 'shouldShowEndBranch' | 'marker' | 'stepProgress'
>;

const defaultMarker = <StepItemIndicator color="neutral" />;

const StepLineVertical = ({
  marker = defaultMarker,
  stepProgress,
  isIndented,
  shouldShowStartBranch,
  shouldShowEndBranch,
}: StepLineSubComponentProps & {
  isIndented?: boolean;
}): React.ReactElement => {
  const { size } = useStepGroup();
  const spacingTokens = getMarkerLineSpacings(size);

  return (
    <Box
      position="relative"
      marginLeft={isIndented ? makeSize(spacingTokens.indentationWidth) : undefined}
      display="flex"
      flexDirection="column"
    >
      <StepStraightLineVertical
        height={itemTopMargin}
        isDotted={stepProgress === 'none' || stepProgress === 'end'}
        visibility={shouldShowStartBranch ? 'visible' : 'hidden'}
      />
      <Box marginLeft={makeSize(-spacingTokens.markerLeftAlignment)}>{marker}</Box>
      <StepStraightLineVertical
        isDotted={stepProgress === 'none' || stepProgress === 'start'}
        visibility={shouldShowEndBranch ? 'visible' : 'hidden'}
      />
    </Box>
  );
};

const StepLineStart = ({
  marker = defaultMarker,
  stepProgress,
  shouldShowStartBranch,
  shouldShowEndBranch,
}: StepLineSubComponentProps): React.ReactElement => {
  const { size } = useStepGroup();
  const spacingTokens = getMarkerLineSpacings(size);

  return (
    <Box position="relative" display="flex" flexDirection="column">
      <StepStraightLineVertical
        height={itemTopMargin}
        visibility={shouldShowStartBranch ? 'visible' : 'hidden'}
        isDotted={stepProgress === 'none' || stepProgress === 'end'}
      />
      <StepTopCurveVertical
        visibility={shouldShowStartBranch ? 'visible' : 'hidden'}
        isDotted={stepProgress === 'none' || stepProgress === 'end'}
      />
      <Box
        marginLeft={makeSize(-spacingTokens.markerLeftAlignment + spacingTokens.indentationWidth)}
        marginTop={makeSize(spacingTokens.markerTopAlignment)}
      >
        {marker}
      </Box>
      <StepStraightLineVertical
        visibility={shouldShowEndBranch ? 'visible' : 'hidden'}
        marginLeft={makeSize(spacingTokens.indentationWidth)}
        isDotted={stepProgress === 'none' || stepProgress === 'start'}
      />
    </Box>
  );
};

const StepLineEnd = ({
  marker = defaultMarker,
  stepProgress,
  shouldShowStartBranch,
  shouldShowEndBranch,
}: StepLineSubComponentProps): React.ReactElement => {
  const { size } = useStepGroup();
  const spacingTokens = getMarkerLineSpacings(size);
  return (
    <Box position="relative" display="flex" flexDirection="column">
      <StepStraightLineVertical
        visibility={shouldShowStartBranch ? 'visible' : 'hidden'}
        marginLeft={makeSize(spacingTokens.indentationWidth)}
        height={itemTopMargin}
        isDotted={stepProgress === 'none' || stepProgress === 'end'}
      />
      <Box
        marginLeft={makeSize(-spacingTokens.markerLeftAlignment + spacingTokens.indentationWidth)}
      >
        {marker}
      </Box>
      <StepStraightLineVertical
        marginLeft={makeSize(spacingTokens.indentationWidth)}
        visibility={shouldShowEndBranch ? 'visible' : 'hidden'}
        isDotted={stepProgress === 'none' || stepProgress === 'start'}
      />
      <StepBottomCurveVertical
        isDotted={stepProgress === 'none' || stepProgress === 'start'}
        visibility={shouldShowEndBranch ? 'visible' : 'hidden'}
      />
    </Box>
  );
};

const StepLineHorizontal = ({
  marker = defaultMarker,
  stepProgress,
  shouldShowStartBranch,
  shouldShowEndBranch,
}: StepLineSubComponentProps): React.ReactElement => {
  return (
    <Box
      position="relative"
      display="flex"
      flexDirection="row"
      width="100%"
      justifyContent="center"
      alignItems="center"
    >
      <StepStraightLineHorizontal
        isDotted={stepProgress === 'none' || stepProgress === 'end'}
        visibility={shouldShowStartBranch ? 'visible' : 'hidden'}
      />
      <Box>{marker}</Box>
      <StepStraightLineHorizontal
        isDotted={stepProgress === 'none' || stepProgress === 'start'}
        visibility={shouldShowEndBranch ? 'visible' : 'hidden'}
      />
    </Box>
  );
};

const StepLineSingleItem = ({
  marker = defaultMarker,
  stepProgress,
  shouldShowEndBranch,
  shouldShowStartBranch,
}: StepLineSubComponentProps): React.ReactElement => {
  const { size } = useStepGroup();
  const spacingTokens = getMarkerLineSpacings(size);
  return (
    <Box position="relative" display="flex" flexDirection="column">
      <StepStraightLineVertical
        visibility={shouldShowStartBranch ? 'visible' : 'hidden'}
        height={itemTopMargin}
        isDotted={stepProgress === 'none' || stepProgress === 'end'}
      />
      <StepTopCurveVertical
        visibility={shouldShowStartBranch ? 'visible' : 'hidden'}
        isDotted={stepProgress === 'none' || stepProgress === 'end'}
      />
      <Box
        // -12 (markerLeftAlginment) + 33 (indentationWidth)
        marginLeft={makeSize(-spacingTokens.markerLeftAlignment + spacingTokens.indentationWidth)}
        marginTop={makeSize(spacingTokens.markerTopAlignment)}
      >
        {marker}
      </Box>
      <StepStraightLineVertical
        marginLeft={makeSize(spacingTokens.indentationWidth)}
        visibility={shouldShowEndBranch ? 'visible' : 'hidden'}
        isDotted={stepProgress === 'none' || stepProgress === 'start'}
      />
      <StepBottomCurveVertical
        visibility={shouldShowEndBranch ? 'visible' : 'hidden'}
        isDotted={stepProgress === 'none' || stepProgress === 'start'}
      />
    </Box>
  );
};

const StepLine = ({
  stepType = 'default',
  shouldShowStartBranch,
  shouldShowEndBranch,
  marker,
  stepProgress,
}: StepLineProps): React.ReactElement => {
  const { orientation } = useStepGroup();
  const commonProps = {
    shouldShowStartBranch,
    shouldShowEndBranch,
    marker,
    stepProgress,
  };

  if (orientation === 'horizontal') {
    return <StepLineHorizontal {...commonProps} />;
  }

  if (stepType === 'start') {
    return <StepLineStart {...commonProps} />;
  }

  if (stepType === 'middle') {
    return <StepLineVertical {...commonProps} isIndented={true} />;
  }

  if (stepType === 'end') {
    return <StepLineEnd {...commonProps} />;
  }

  if (stepType === 'single-item') {
    return <StepLineSingleItem {...commonProps} />;
  }

  return <StepLineVertical {...commonProps} />;
};

export type { StepLineProps };
export { StepLine };
