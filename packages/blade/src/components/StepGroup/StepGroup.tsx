import styled from 'styled-components';
import { Box } from '~components/Box';
import BaseBox from '~components/Box/BaseBox';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { IconComponent } from '~components/Icons';
import { CheckIcon } from '~components/Icons';
import Svg from '~components/Icons/_Svg';
import { Text } from '~components/Typography';
import { makeSize } from '~utils';

type StepLineSvgProps = {
  height?: number;
} & StyledPropsBlade;

// const StyledLine = styled(Base)((props) => {
//   return {
//     flex: 1,
//     width: '2px',
//     height: 'auto',
//     backgroundColor,
//   };
// });

const StepStraightLineVertical = ({
  height,
  ...styledProps
}: StepLineSvgProps): React.ReactElement => {
  return (
    <BaseBox
      height={height ? makeSize(height) : undefined}
      flex={height ? undefined : '1'}
      width="0px"
      borderLeftWidth="thicker"
      borderLeftColor="surface.border.gray.subtle"
      {...styledProps}
    />
    // <Svg width="2" height={String(height)} viewBox={`0 0 2 ${height}`} fill="none" {...styledProps}>
    //   <line
    //     x1="1"
    //     y1="1"
    //     x2="0.999995"
    //     y2="119"
    //     stroke="#B1C1D2"
    //     strokeWidth="2"
    //     strokeLinecap="square"
    //   />
    // </Svg>
  );
};

const StepTopCurveVertical = (styledProps: StyledPropsBlade): React.ReactElement => {
  return (
    <Svg width="20" height="14" viewBox="0 0 20 14" fill="none" {...styledProps}>
      <path d="M1 0V1C1 7.62742 6.37258 13 13 13H20" stroke="#B1C1D2" strokeWidth="2" />
    </Svg>
  );
};

const StepBottomCurveVertical = (styledProps: StyledPropsBlade): React.ReactElement => {
  return (
    <Svg width="35" height="25" viewBox="0 0 35 25" fill="none" {...styledProps}>
      <path
        d="M1 25V21.3088C1 17.4754 3.71928 14.1808 7.48316 13.4539L27.5168 9.58528C31.2807 8.85845 34 5.56381 34 1.7304V-2.98023e-08"
        stroke="#B1C1D2"
        strokeWidth="2"
      />
    </Svg>
  );
};

const StepLine = ({
  orientation = 'vertical',
  curveEnd,
  ...styledProps
}: {
  orientation: 'horizontal' | 'vertical';
  curveEnd?: 'top' | 'bottom';
} & StyledPropsBlade): React.ReactElement => {
  if (orientation === 'vertical') {
    if (curveEnd === 'top') {
      return <StepTopCurveVertical {...styledProps} />;
    }

    if (curveEnd === 'bottom') {
      return <StepBottomCurveVertical {...styledProps} />;
    }
    return <StepStraightLineVertical {...styledProps} />;
  }

  return <StepStraightLineVertical {...styledProps} />;
};

type StepItemIconProps = {
  icon: IconComponent;
  color: 'positive' | 'negative' | 'neutral';
};

const StepItemIcon = ({ icon: Icon, color }: StepItemIconProps): React.ReactElement => {
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
      marginLeft="-12px"
      // position="absolute"
      // top="spacing.0"
      // left="-12px"
    >
      <Icon color={`feedback.icon.${color}.intense`} />
    </BaseBox>
  );
};

type StepLineProps = StepItemIconProps & StyledPropsBlade;

const StepLineVertical = ({ icon, color, ...styledProps }: StepLineProps): React.ReactElement => {
  return (
    <Box position="relative" display="flex" flexDirection="column" {...styledProps}>
      <StepStraightLineVertical height={16} />
      <StepItemIcon icon={icon} color={color} />
      <StepStraightLineVertical />
    </Box>
  );
};

const StepItem = (): React.ReactElement => {
  return (
    <Box display="flex" flexDirection="row" gap="spacing.4">
      <StepLineVertical icon={CheckIcon} color="neutral" />
      <Box paddingY="spacing.3" marginTop="spacing.3" paddingX="spacing.4">
        <Text size="large" color="surface.text.gray.subtle" weight="semibold">
          Header Title
        </Text>
        <Text marginY="spacing.2" size="medium" color="surface.text.gray.muted" variant="caption">
          Wed, 27th Mar’24 | 12:00pm
        </Text>
        <Text size="medium" color="surface.text.gray.muted">
          Description
        </Text>
      </Box>
    </Box>
  );
};

export { StepLine, StepItem };
