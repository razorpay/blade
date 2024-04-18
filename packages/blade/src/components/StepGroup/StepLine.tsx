import { Box, BoxProps } from '~components/Box';
import BaseBox, { BaseBoxProps } from '~components/Box/BaseBox';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { IconComponent } from '~components/Icons';
import { CheckIcon } from '~components/Icons';
import Svg from '~components/Icons/_Svg';
import { Text } from '~components/Typography';
import { makeSize, useTheme } from '~utils';

type StepLineSvgProps = {
  height?: number;
} & StyledPropsBlade;

const useDottedLineStyles = (): BaseBoxProps => {
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
    backgroundPosition: 'right',
    backgroundSize: '2px 4px',
    backgroundRepeat: 'repeat-y',
  };
};

const StepStraightLineVertical = ({
  height,
  ...styledProps
}: StepLineSvgProps): React.ReactElement => {
  // const dottedStyles = useDottedLineStyles();

  return (
    <BaseBox
      height={height ? makeSize(height) : undefined}
      flex={height ? undefined : '1'}
      width="2px"
      // {...dottedStyles}
      borderLeftWidth="thicker"
      borderLeftColor="surface.border.gray.subtle"
      // borderLeftStyle="dotted"
      {...styledProps}
    />

    // <BaseBox
    //   height={height ? makeSize(height) : '100%'}
    //   // backgroundColor="surface.background.sea.intense"
    //   flex={height ? undefined : 1}
    //   // flexShrink="0"
    //   // flexGrow="0"
    //   overflow="hidden"
    // >
    //   <Svg width="2" height="100%" viewBox="0 0 2 120" fill="none" {...styledProps}>
    //     <line
    //       x1="1"
    //       y1="1"
    //       x2="0.999995"
    //       y2="119"
    //       stroke="#CBD5E2"
    //       strokeWidth="2"
    //       strokeLinecap="square"
    //     />
    //   </Svg>
    // </BaseBox>
  );
};

const StepTopCurveVertical = (styledProps: StyledPropsBlade): React.ReactElement => {
  return (
    <Svg width="20" height="14" viewBox="0 0 20 14" fill="none" {...styledProps}>
      <path d="M1 0V1C1 7.62742 6.37258 13 13 13H20" stroke="#CBD5E2" strokeWidth="2" />
    </Svg>
    // <Svg width={35} height={25} fill="none" flexShrink="0">
    //   <path
    //     stroke="#CBD5E2"
    //     strokeDasharray="0.2 6"
    //     strokeWidth={2}
    //     d="M1 25v-6.993a4 4 0 0 1 3.242-3.927l26.516-5.12A4 4 0 0 0 34 5.031V0"
    //   />
    // </Svg>
    // <Svg width="21" height="14" viewBox="0 0 21 14" fill="none" {...styledProps}>
    //   <path
    //     d="M1.5 0V5C1.5 9.41828 5.08172 13 9.5 13H20.5"
    //     stroke="#CBD5E2"
    //     strokeWidth="2"
    //     strokeDasharray="2 2"
    //   />
    // </Svg>
  );
};

const StepBottomCurveVertical = (styledProps: StyledPropsBlade): React.ReactElement => {
  return (
    <Svg width="35" height="25" viewBox="0 0 35 25" fill="none" {...styledProps}>
      <path
        d="M1 25V21.3088C1 17.4754 3.71928 14.1808 7.48316 13.4539L27.5168 9.58528C31.2807 8.85845 34 5.56381 34 1.7304V-2.98023e-08"
        stroke="#CBD5E2"
        strokeWidth="2"
      />
    </Svg>
  );
};

// const StepLine = ({
//   orientation = 'vertical',
//   curveEnd,
//   ...styledProps
// }: {
//   orientation: 'horizontal' | 'vertical';
//   curveEnd?: 'top' | 'bottom';
// } & StyledPropsBlade): React.ReactElement => {
//   if (orientation === 'vertical') {
//     if (curveEnd === 'top') {
//       return <StepTopCurveVertical {...styledProps} />;
//     }

//     if (curveEnd === 'bottom') {
//       return <StepBottomCurveVertical {...styledProps} />;
//     }
//     return <StepStraightLineVertical {...styledProps} />;
//   }

//   return <StepStraightLineVertical {...styledProps} />;
// };

type IconColorType = {
  icon: IconComponent;
  color: 'positive' | 'negative' | 'neutral';
};
type StepItemIconProps = IconColorType & BoxProps;

const StepItemIcon = ({
  icon: Icon,
  color,
  ...boxProps
}: StepItemIconProps): React.ReactElement => {
  return (
    <BaseBox
      backgroundColor={`feedback.background.${color}.subtle`}
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="24px"
      width="24px"
      borderRadius="round"
      zIndex={1}
      margin="2px"
      {...boxProps}
      // position="absolute"
      // top="spacing.0"
      // left="-12px"
    >
      <Icon color={`feedback.icon.${color}.intense`} />
    </BaseBox>
  );
};

type StepLineProps = {
  stepType: 'single-item' | 'start' | 'middle' | 'end' | 'default';
  shouldShowStartBranch: boolean;
  shouldShowEndBranch: boolean;
} & StepItemIconProps;

type StepLineVisualProps = Pick<StepLineProps, 'shouldShowStartBranch' | 'shouldShowEndBranch'> &
  IconColorType & {
    isIndented?: boolean;
  };

// const INDENTATION_WIDTH = 33;
// const ICON_WIDTH = 24;
// const ICON_NEGATIVE_MARGIN = 12;

const StepLineVertical = ({
  icon,
  color,
  isIndented,
  shouldShowStartBranch,
  shouldShowEndBranch,
}: StepLineVisualProps): React.ReactElement => {
  return (
    <Box
      position="relative"
      marginLeft={isIndented ? '33px' : undefined}
      display="flex"
      flexDirection="column"
    >
      <StepStraightLineVertical
        height={16}
        visibility={shouldShowStartBranch ? 'visible' : 'hidden'}
      />
      <StepItemIcon icon={icon} color={color} marginLeft="-12px" /> {/* -12 + 33 */}
      <StepStraightLineVertical visibility={shouldShowEndBranch ? 'visible' : 'hidden'} />
    </Box>
  );
};

const StepLineStart = ({
  icon,
  color,
  shouldShowStartBranch,
  shouldShowEndBranch,
}: StepLineVisualProps): React.ReactElement => {
  return (
    <Box position="relative" display="flex" flexDirection="column">
      <StepStraightLineVertical
        height={16}
        visibility={shouldShowStartBranch ? 'visible' : 'hidden'}
      />
      <StepTopCurveVertical visibility={shouldShowStartBranch ? 'visible' : 'hidden'} />
      <StepItemIcon icon={icon} color={color} marginLeft="22px" marginTop="-12px" />
      <StepStraightLineVertical
        visibility={shouldShowEndBranch ? 'visible' : 'hidden'}
        marginLeft="33px"
      />
    </Box>
  );
};

const StepLineEnd = ({
  icon,
  color,
  shouldShowStartBranch,
  shouldShowEndBranch,
}: StepLineVisualProps): React.ReactElement => {
  return (
    <Box position="relative" display="flex" flexDirection="column">
      <StepStraightLineVertical
        visibility={shouldShowStartBranch ? 'visible' : 'hidden'}
        marginLeft="33px"
        height={16}
      />
      <StepItemIcon icon={icon} color={color} marginLeft="21px" /> {/* -12 + 33 */}
      <StepStraightLineVertical
        marginLeft="33px"
        visibility={shouldShowEndBranch ? 'visible' : 'hidden'}
      />
      <StepBottomCurveVertical visibility={shouldShowEndBranch ? 'visible' : 'hidden'} />
    </Box>
  );
};

const StepLineSingleItem = ({
  icon,
  color,
  shouldShowEndBranch,
  shouldShowStartBranch,
}: StepLineVisualProps): React.ReactElement => {
  return (
    <Box position="relative" display="flex" flexDirection="column">
      <StepStraightLineVertical
        visibility={shouldShowStartBranch ? 'visible' : 'hidden'}
        height={16}
      />
      <StepTopCurveVertical visibility={shouldShowStartBranch ? 'visible' : 'hidden'} />
      {/* -12 + 33 */}
      <StepItemIcon icon={icon} color={color} marginLeft="21px" marginTop="-12px" />{' '}
      <StepStraightLineVertical
        marginLeft="33px"
        visibility={shouldShowEndBranch ? 'visible' : 'hidden'}
      />
      <StepBottomCurveVertical visibility={shouldShowEndBranch ? 'visible' : 'hidden'} />
    </Box>
  );
};

const StepLine = ({
  stepType = 'default',
  icon,
  color,
  shouldShowStartBranch,
  shouldShowEndBranch,
}: StepLineProps): React.ReactElement => {
  const commonProps = {
    icon,
    color,
    shouldShowStartBranch,
    shouldShowEndBranch,
  };

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
