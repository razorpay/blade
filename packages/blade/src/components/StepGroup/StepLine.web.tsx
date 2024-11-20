/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { encode } from 'universal-base64';
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

  const backgroundURL = `url(data:image/svg+xml;base64,${encode(svgString)})`;

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
    <Svg width="20" height="14" viewBox="0 0 20 14" fill="none">
      <Path d="M1 0V5C1 9.41828 4.58172 13 9 13H20" stroke="#6C849D" strokeWidth="2" />
    </Svg>
  );
};

const StepBottomCurveVertical = ({
  isDotted,
  ...styledProps
}: StepLineSvgProps): React.ReactElement => {
  const { theme } = useTheme();

  return isDotted ? (
    <Svg width="32" height="7" viewBox="0 0 32 7" fill="none">
      <Path
        d="M1 6V6C1 4.6325 2.10799 3.5236 3.47549 3.52249L28.5 3.50204C29.881 3.50091 31 2.38104 31 1V1"
        stroke="#6C849D"
        strokeWidth="2"
        strokeDasharray="0.2 6"
      />
    </Svg>
  ) : (
    <Svg width="33" height="5" viewBox="0 0 33 5" fill="none">
      <Path
        d="M1 5V5C1 3.63251 2.108 2.52363 3.47549 2.52255L29.5 2.50198C30.881 2.50088 32 1.38103 32 1.19209e-07V1.19209e-07"
        stroke="yellow"
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
