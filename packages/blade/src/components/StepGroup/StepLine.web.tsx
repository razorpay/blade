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
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill={theme.colors.surface.border.gray.subtle}
      {...styledProps}
    >
      <Path d="M2 1C2 1.55228 1.55228 2 1 2C0.447715 2 0 1.55228 0 1C0 0.447715 0.447715 0 1 0C1.55228 0 2 0.447715 2 1Z" />
      <Path d="M2 6C2 6.55228 1.55228 7 1 7C0.447715 7 0 6.55228 0 6C0 5.44772 0.447715 5 1 5C1.55228 5 2 5.44772 2 6Z" />
      <Path d="M1 12C1.55228 12 2 11.5523 2 11C2 10.4477 1.55228 10 1 10C0.447715 10 0 10.4477 0 11C0 11.5523 0.447715 12 1 12Z" />
      <Path d="M3 16C3 16.5523 2.55228 17 2 17C1.44772 17 1 16.5523 1 16C1 15.4477 1.44772 15 2 15C2.55228 15 3 15.4477 3 16Z" />
      <Path d="M7 20C7.55228 20 8 19.5523 8 19C8 18.4477 7.55228 18 7 18C6.44772 18 6 18.4477 6 19C6 19.5523 6.44772 20 7 20Z" />
      <Path d="M14 19C14 19.5523 13.5523 20 13 20C12.4477 20 12 19.5523 12 19C12 18.4477 12.4477 18 13 18C13.5523 18 14 18.4477 14 19Z" />
      <Path d="M19 20C19.5523 20 20 19.5523 20 19C20 18.4477 19.5523 18 19 18C18.4477 18 18 18.4477 18 19C18 19.5523 18.4477 20 19 20Z" />
    </Svg>
  ) : (
    <Svg width="20" height="14" viewBox="0 0 20 14" fill="none" {...styledProps}>
      <Path
        d="M1 0V5C1 9.41828 4.58172 13 9 13H20"
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
  const { size } = useStepGroup();

  if (size === 'medium') {
    return isDotted ? (
      <Svg
        width="42"
        height="5"
        viewBox="0 0 42 5"
        fill={theme.colors.surface.border.gray.subtle}
        {...styledProps}
      >
        <Path d="M32 1C32 1.55228 31.5523 2 31 2C30.4477 2 30 1.55228 30 1C30 0.447715 30.4477 0 31 0C31.5523 0 32 0.447715 32 1Z" />
        <Path d="M2 4C2 4.55228 1.55228 5 1 5C0.447715 5 0 4.55228 0 4C0 3.44772 0.447715 3 1 3C1.55228 3 2 3.44772 2 4Z" />
        <Path d="M27.5 3.5C28.0523 3.5 28.5 3.05228 28.5 2.5C28.5 1.94772 28.0523 1.5 27.5 1.5C26.9477 1.5 26.5 1.94772 26.5 2.5C26.5 3.05228 26.9477 3.5 27.5 3.5Z" />
        <Path d="M5.5 2.5C5.5 3.05228 5.05228 3.5 4.5 3.5C3.94772 3.5 3.5 3.05228 3.5 2.5C3.5 1.94772 3.94772 1.5 4.5 1.5C5.05228 1.5 5.5 1.94772 5.5 2.5Z" />
        <Path d="M16.5 3.5C17.0523 3.5 17.5 3.05228 17.5 2.5C17.5 1.94772 17.0523 1.5 16.5 1.5C15.9477 1.5 15.5 1.94772 15.5 2.5C15.5 3.05228 15.9477 3.5 16.5 3.5Z" />
        <Path d="M11.5 2.5C11.5 3.05228 11.0523 3.5 10.5 3.5C9.94771 3.5 9.5 3.05228 9.5 2.5C9.5 1.94772 9.94771 1.5 10.5 1.5C11.0523 1.5 11.5 1.94772 11.5 2.5Z" />
        <Path d="M22.5 3.5C23.0523 3.5 23.5 3.05228 23.5 2.5C23.5 1.94772 23.0523 1.5 22.5 1.5C21.9477 1.5 21.5 1.94772 21.5 2.5C21.5 3.05228 21.9477 3.5 22.5 3.5Z" />
      </Svg>
    ) : (
      <Svg width="33" height="5" viewBox="0 0 33 5" fill="none">
        <Path
          d="M1 5V5C1 3.63251 2.108 2.52363 3.47549 2.52255L29.5 2.50198C30.881 2.50088 32 1.38103 32 1.19209e-07V1.19209e-07"
          stroke={theme.colors.surface.border.gray.subtle}
          strokeWidth="2"
        />
      </Svg>
    );
  }

  return isDotted ? (
    <Svg
      width="46"
      height="5"
      viewBox="0 0 46 5"
      fill={theme.colors.surface.border.gray.subtle}
      {...styledProps}
    >
      <Path d="M35 1C35 1.55228 34.5523 2 34 2C33.4477 2 33 1.55228 33 1C33 0.447715 33.4477 0 34 0C34.5523 0 35 0.447715 35 1Z" />
      <Path d="M2 4C2 4.55228 1.55228 5 1 5C0.447715 5 0 4.55228 0 4C0 3.44772 0.447715 3 1 3C1.55228 3 2 3.44772 2 4Z" />
      <Path d="M31.5 3.5C32.0523 3.5 32.5 3.05228 32.5 2.5C32.5 1.94772 32.0523 1.5 31.5 1.5C30.9477 1.5 30.5 1.94772 30.5 2.5C30.5 3.05228 30.9477 3.5 31.5 3.5Z" />
      <Path d="M4.5 2.5C4.5 3.05228 4.05228 3.5 3.5 3.5C2.94772 3.5 2.5 3.05228 2.5 2.5C2.5 1.94772 2.94772 1.5 3.5 1.5C4.05228 1.5 4.5 1.94772 4.5 2.5Z" />
      <Path d="M17.5 3.5C18.0523 3.5 18.5 3.05228 18.5 2.5C18.5 1.94772 18.0523 1.5 17.5 1.5C16.9477 1.5 16.5 1.94772 16.5 2.5C16.5 3.05228 16.9477 3.5 17.5 3.5Z" />
      <Path d="M11.5 2.5C11.5 3.05228 11.0523 3.5 10.5 3.5C9.94771 3.5 9.5 3.05228 9.5 2.5C9.5 1.94772 9.94771 1.5 10.5 1.5C11.0523 1.5 11.5 1.94772 11.5 2.5Z" />
      <Path d="M24.5 3.5C25.0523 3.5 25.5 3.05228 25.5 2.5C25.5 1.94772 25.0523 1.5 24.5 1.5C23.9477 1.5 23.5 1.94772 23.5 2.5C23.5 3.05228 23.9477 3.5 24.5 3.5Z" />
    </Svg>
  ) : (
    <Svg width="35" height="6" viewBox="0 0 35 6" fill="none" {...styledProps}>
      <Path
        d="M1 6V6C1 4.36914 2.31973 3.04584 3.95058 3.04142L31.04 2.96802C32.6761 2.96359 34 1.63606 34 1.3411e-07V1.3411e-07"
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
