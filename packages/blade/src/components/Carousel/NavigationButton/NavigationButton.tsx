import type { ReactElement } from 'react';
import React from 'react';
import type { NavigationButtonProps } from './types';
import { StyledNavigationButton } from './StyledNavigationButton';
import { ChevronLeftIcon, ChevronRightIcon } from '~components/Icons';
import { isReactNative, useTheme } from '~utils';
import { metaAttribute } from '~utils/metaAttribute';
import { makeAccessible } from '~utils/makeAccessible';

const NavigationButton = ({ type, variant, onClick }: NavigationButtonProps): ReactElement => {
  const { platform } = useTheme();
  const isMobile = platform === 'onMobile';
  const iconSize = isMobile ? 'small' : 'medium';

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const getIconColor = () => {
    if (!isReactNative()) {
      return 'currentColor' as const;
    }

    // on react native we cannot rely on currentColor thus need to manually pass iconColor
    const iconColor = {
      filled: 'action.icon.tertiary.default',
      stroked: 'surface.action.icon.active.highContrast',
    } as const;

    return iconColor[variant];
  };

  return (
    <StyledNavigationButton
      onClick={onClick}
      variant={variant}
      {...metaAttribute({ name: 'NavigationButton' })}
      {...makeAccessible({ label: type === 'previous' ? 'Previous Slide' : 'Next Slide' })}
    >
      {type === 'next' ? (
        <ChevronRightIcon size={iconSize} color={getIconColor()} />
      ) : (
        <ChevronLeftIcon size={iconSize} color={getIconColor()} />
      )}
    </StyledNavigationButton>
  );
};

export type { NavigationButtonProps };
export { NavigationButton };
