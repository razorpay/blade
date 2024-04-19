import type { StepItemProps } from './types';
import { StepItemIndicator } from './StepItemMarker';
import { useStepGroup } from './StepGroupContext';
import { getLineSpacings } from './tokens';
import { Box } from '~components/Box';
import type { BaseBoxProps } from '~components/Box/BaseBox';
import BaseBox from '~components/Box/BaseBox';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import Svg from '~components/Icons/_Svg';
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
    backgroundPosition: isHorizontal ? 'top' : 'right',
    backgroundSize: isHorizontal ? '6px 2px' : '2px 6px',
    backgroundRepeat: isHorizontal ? 'repeat-x' : 'repeat-y',
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

  return <BaseBox height="2px" flex="1" {...borderStyles} {...styledProps} />;
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
      width="2px"
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
    <Svg width="21" height="16" viewBox="0 0 21 16" fill={theme.colors.surface.border.gray.subtle}>
      <path d="M1 2.3916C1.55225 2.3916 2 1.94434 2 1.3916C2 1.28125 1.98193 1.1748 1.94873 1.0752C1.89307 0.908203 1.79541 0.761719 1.66797 0.647461L1.61182 0.600586C1.58496 0.580078 1.55762 0.560547 1.52881 0.542969C1.45459 0.49707 1.37451 0.459961 1.28955 0.43457C1.19824 0.407227 1.10107 0.391602 1 0.391602C0.447754 0.391602 0 0.838867 0 1.3916C0 1.80957 0.255859 2.16699 0.619629 2.31641C0.736816 2.36523 0.865234 2.3916 1 2.3916Z" />
      <path d="M1 7.26953C1.55225 7.26953 2 6.82227 2 6.26953C2 5.7168 1.55225 5.26953 1 5.26953C0.447754 5.26953 0 5.7168 0 6.26953C0 6.37695 0.0170898 6.48047 0.0478516 6.57715C0.0942383 6.7207 0.172363 6.85059 0.273926 6.95703C0.456055 7.14941 0.713867 7.26953 1 7.26953Z" />
      <path d="M4.07812 12.7373C3.89453 12.9512 3.62207 13.0869 3.31787 13.0869C2.76562 13.0869 2.31787 12.6396 2.31787 12.0869C2.31787 11.5342 2.76562 11.0869 3.31787 11.0869C3.87012 11.0869 4.31787 11.5342 4.31787 12.0869C4.31787 12.335 4.22754 12.5625 4.07812 12.7373Z" />
      <path d="M9.04736 15.3916C9.59961 15.3916 10.0474 14.9443 10.0474 14.3916C10.0474 13.8389 9.59961 13.3916 9.04736 13.3916C8.49512 13.3916 8.04736 13.8389 8.04736 14.3916C8.04736 14.9443 8.49512 15.3916 9.04736 15.3916Z" />
      <path d="M15.5581 14.3916C15.5581 14.9443 15.1104 15.3916 14.5581 15.3916C14.2788 15.3916 14.0264 15.2773 13.8447 15.0928C13.6675 14.9121 13.5581 14.665 13.5581 14.3916C13.5581 13.8389 14.0059 13.3916 14.5581 13.3916C15.1104 13.3916 15.5581 13.8389 15.5581 14.3916Z" />
      <path d="M20 15.3916C20.5522 15.3916 21 14.9443 21 14.3916C21 13.8389 20.5522 13.3916 20 13.3916C19.4478 13.3916 19 13.8389 19 14.3916C19 14.9443 19.4478 15.3916 20 15.3916Z" />
    </Svg>
  ) : (
    <Svg width="20" height="14" viewBox="0 0 20 14" fill="none" {...styledProps}>
      <path
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
    <Svg width="36" height="28" viewBox="0 0 36 28" fill={theme.colors.surface.border.gray.subtle}>
      <path d="M35.5967 1.37793C35.5967 1.93066 35.1489 2.37793 34.5967 2.37793C34.0444 2.37793 33.5967 1.93066 33.5967 1.37793C33.5967 0.825195 34.0444 0.37793 34.5967 0.37793C34.8433 0.37793 35.0688 0.466797 35.2432 0.614258C35.3438 0.699219 35.4268 0.803711 35.4873 0.921875C35.5571 1.05859 35.5967 1.21387 35.5967 1.37793Z" />
      <path d="M35.2534 6.82227C35.0776 6.97559 34.8481 7.06836 34.5967 7.06836C34.3853 7.06836 34.1895 7.00293 34.0278 6.8916C33.7671 6.71094 33.5967 6.40918 33.5967 6.06836C33.5967 6.00293 33.603 5.93848 33.6152 5.87598C33.626 5.82129 33.6406 5.76953 33.6597 5.71875C33.7163 5.56738 33.8081 5.43359 33.9258 5.32715C34.103 5.16602 34.3384 5.06836 34.5967 5.06836C34.7197 5.06836 34.8374 5.09082 34.9463 5.13184C35.0146 5.15723 35.0791 5.18945 35.1392 5.22852C35.4146 5.40625 35.5967 5.71582 35.5967 6.06836C35.5967 6.36914 35.4639 6.63965 35.2534 6.82227Z" />
      <path d="M31.3296 11.0068C31.8818 11.0068 32.3296 10.5596 32.3296 10.0068C32.3296 9.7207 32.2095 9.46289 32.0166 9.28027C31.9229 9.19238 31.812 9.12109 31.6899 9.07324C31.5781 9.03027 31.4565 9.00684 31.3296 9.00684C30.7773 9.00684 30.3296 9.4541 30.3296 10.0068C30.3296 10.5596 30.7773 11.0068 31.3296 11.0068Z" />
      <path d="M25.6934 11.3438C25.6934 11.6133 25.5869 11.8574 25.4136 12.0371C25.2314 12.2266 24.9761 12.3438 24.6934 12.3438C24.5757 12.3438 24.4624 12.3232 24.3574 12.2861C24.2192 12.2373 24.0952 12.1582 23.9927 12.0576C23.8081 11.876 23.6934 11.623 23.6934 11.3438C23.6934 10.9922 23.8745 10.6836 24.1484 10.5049C24.3052 10.4033 24.4922 10.3438 24.6934 10.3438C25.2456 10.3438 25.6934 10.791 25.6934 11.3438Z" />
      <path d="M18.0967 13.5332C18.6489 13.5332 19.0967 13.0859 19.0967 12.5332C19.0967 11.9805 18.6489 11.5332 18.0967 11.5332C17.9502 11.5332 17.811 11.5645 17.6855 11.6211C17.6436 11.6396 17.6035 11.6611 17.5649 11.6855C17.5356 11.7041 17.5073 11.7236 17.48 11.7451C17.4399 11.7764 17.4028 11.8105 17.3682 11.8477C17.1997 12.0264 17.0967 12.2676 17.0967 12.5332C17.0967 13.0859 17.5444 13.5332 18.0967 13.5332Z" />
      <path d="M12.2383 14.5146C12.0552 14.7148 11.7925 14.8398 11.5 14.8398C10.9478 14.8398 10.5 14.3926 10.5 13.8398C10.5 13.7666 10.5078 13.6943 10.5229 13.625C10.5347 13.5713 10.5503 13.5195 10.5703 13.4697C10.6255 13.332 10.7104 13.209 10.8174 13.1094C10.9961 12.9424 11.2358 12.8398 11.5 12.8398C11.7827 12.8398 12.0376 12.957 12.2197 13.1455C12.2949 13.2236 12.3574 13.3135 12.4043 13.4131C12.4658 13.543 12.5 13.6875 12.5 13.8398C12.5 13.9375 12.4863 14.0312 12.4604 14.1201C12.417 14.2686 12.3398 14.4033 12.2383 14.5146Z" />
      <path d="M5.12354 16.0049C5.08691 16.0137 5.04932 16.0205 5.01123 16.0254C4.9707 16.0303 4.9292 16.0332 4.88721 16.0332C4.33496 16.0332 3.88721 15.5859 3.88721 15.0332C3.88721 14.4805 4.33496 14.0332 4.88721 14.0332C5.13525 14.0332 5.3623 14.124 5.53711 14.2734C5.58594 14.3154 5.63037 14.3613 5.67041 14.4111C5.70264 14.4521 5.73193 14.4951 5.75781 14.541C5.83984 14.6855 5.88721 14.8535 5.88721 15.0332C5.88721 15.4268 5.66016 15.7666 5.33057 15.9297L5.27246 15.957L5.22949 15.9736C5.19482 15.9863 5.15967 15.9971 5.12354 16.0049Z" />
      <path d="M1.59668 27.0332C2.14893 27.0332 2.59668 26.5859 2.59668 26.0332C2.59668 25.4805 2.14893 25.0332 1.59668 25.0332C1.04443 25.0332 0.59668 25.4805 0.59668 26.0332C0.59668 26.5859 1.04443 27.0332 1.59668 27.0332Z" />
      <path d="M1.59668 20.0273C2.14893 20.0273 2.59668 19.5801 2.59668 19.0273C2.59668 18.4746 2.14893 18.0273 1.59668 18.0273C1.04443 18.0273 0.59668 18.4746 0.59668 19.0273C0.59668 19.5801 1.04443 20.0273 1.59668 20.0273Z" />
    </Svg>
  ) : (
    <Svg width="35" height="25" viewBox="0 0 35 25" fill="none" {...styledProps}>
      <path
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
  const spacingTokens = getLineSpacings(size);

  return (
    <Box
      position="relative"
      marginLeft={isIndented ? makeSize(spacingTokens.indentationWidth) : undefined}
      display="flex"
      flexDirection="column"
    >
      <StepStraightLineVertical
        height={spacingTokens.itemTopMargin}
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
  const spacingTokens = getLineSpacings(size);

  return (
    <Box position="relative" display="flex" flexDirection="column">
      <StepStraightLineVertical
        height={spacingTokens.itemTopMargin}
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
  const spacingTokens = getLineSpacings(size);
  return (
    <Box position="relative" display="flex" flexDirection="column">
      <StepStraightLineVertical
        visibility={shouldShowStartBranch ? 'visible' : 'hidden'}
        marginLeft={makeSize(spacingTokens.indentationWidth)}
        height={spacingTokens.itemTopMargin}
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
  const spacingTokens = getLineSpacings(size);
  return (
    <Box position="relative" display="flex" flexDirection="column">
      <StepStraightLineVertical
        visibility={shouldShowStartBranch ? 'visible' : 'hidden'}
        height={spacingTokens.itemTopMargin}
        isDotted={stepProgress === 'none' || stepProgress === 'end'}
      />
      <StepTopCurveVertical
        visibility={shouldShowStartBranch ? 'visible' : 'hidden'}
        isDotted={stepProgress === 'none' || stepProgress === 'end'}
      />
      <Box
        // -12 (markerLeftAlginment) + 33 (indentationWidth)
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
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
export { StepLine, StepItemIndicator };
