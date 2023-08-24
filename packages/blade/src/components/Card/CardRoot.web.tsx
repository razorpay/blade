import styled from 'styled-components';
import type { CardRootProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { castWebType, makeMotionTime } from '~utils';
import { makeAccessible } from '~utils/makeAccessible';

const StyledCardRoot = styled(BaseBox)<CardRootProps>(
  ({ theme, isSelected, isFocused, scaleOnHover }) => {
    const selectedColor = isSelected ? theme.colors.brand.primary[500] : 'transparent';
    return {
      // Selected state
      // TODO: use thicker
      boxShadow: `0px 0px 0px ${theme.border.width.thick}px ${selectedColor}`,
      transitionDuration: castWebType(makeMotionTime(theme.motion.duration.xquick)),
      transitionTimingFunction: castWebType(theme.motion.easing.standard.effective),
      transitionProperty: 'transform, box-shadow',

      // link focused state
      ...(isFocused && {
        boxShadow: `0px 0px 0px 4px ${theme.colors.brand.primary[400]}`,
      }),

      // Hover state
      ...(scaleOnHover && {
        '&:hover': {
          transform: 'scale(1.05)',
        },
      }),

      // uplift all the nested links so they receive clicks and events (except the LinkOverlay)
      // https://www.sarasoueidan.com/blog/nested-links
      '& a[href]:not(a[data-blade-component="card-link-overlay"])': {
        zIndex: 1,
        position: 'relative',
      },
    };
  },
);

const CardRoot = ({
  as,
  accessibilityLabel,
  children,
  ...props
}: CardRootProps): React.ReactElement => {
  return (
    <StyledCardRoot
      as={as}
      {...props}
      {...makeAccessible({ label: as === 'label' ? accessibilityLabel : undefined })}
    >
      {children}
    </StyledCardRoot>
  );
};

export { CardRoot };
