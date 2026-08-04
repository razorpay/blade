import React from 'react';
import type { GestureResponderEvent } from 'react-native';
import { useCheckboxGroupContext } from '~components/Checkbox/CheckboxGroup/CheckboxGroupContext';
import { useRadioGroupContext } from '~components/Radio/RadioGroup/RadioContext';
import type { CheckboxGroupContextType } from '~components/Checkbox/CheckboxGroup/CheckboxGroupContext';
import type { RadioGroupContextType } from '~components/Radio/RadioGroup/RadioContext';
import { makeAccessible } from '~utils/makeAccessible';
import { metaAttribute } from '~utils/metaAttribute';
import { CARD_LINK_OVERLAY_ID } from './constants';
import type { LinkOverlayProps } from './types';
import type { CardProps } from './Card';
import type { Platform } from '~utils';

type SectionedCardInteractiveProps = Pick<
  CardProps,
  'isSelected' | 'isDisabled' | 'accessibilityLabel' | 'href' | 'onClick'
> & {
  target?: string;
  onClick?: (
    event: Platform.Select<{
      web: React.MouseEvent;
      native: GestureResponderEvent;
    }>,
  ) => void;
};

type SectionedCardState = {
  isFocused: boolean;
  setIsFocused: React.Dispatch<React.SetStateAction<boolean>>;
  isCardDisabled: boolean;
  isCardSelected: boolean;
  linkOverlayProps: LinkOverlayProps;
  defaultRel: string | undefined;
};

const useSectionedCardState = ({
  isSelected = false,
  isDisabled = false,
  accessibilityLabel,
  href,
  target,
}: SectionedCardInteractiveProps): SectionedCardState => {
  const [isFocused, setIsFocused] = React.useState(false);

  const checkboxGroupProps = useCheckboxGroupContext();
  const radioGroupProps = useRadioGroupContext();

  const getGroupProps = (): CheckboxGroupContextType | RadioGroupContextType | undefined => {
    if (Object.keys(checkboxGroupProps).length > 0) return checkboxGroupProps;
    if (Object.keys(radioGroupProps).length > 0) return radioGroupProps;
    return undefined;
  };

  const groupProps = getGroupProps();
  const isCardDisabled = isDisabled || Boolean(groupProps?.isDisabled);
  const isCardSelected = isSelected && !isCardDisabled;

  const linkOverlayProps: LinkOverlayProps = {
    ...metaAttribute({ name: CARD_LINK_OVERLAY_ID }),
    ...makeAccessible({ label: accessibilityLabel, pressed: href ? undefined : isCardSelected }),
    onFocus: () => {
      setIsFocused(true);
    },
    onBlur: () => {
      setIsFocused(false);
    },
  };

  const defaultRel = target && target === '_blank' ? 'noreferrer noopener' : undefined;

  return {
    isFocused,
    setIsFocused,
    isCardDisabled,
    isCardSelected,
    linkOverlayProps,
    defaultRel,
  };
};

export { useSectionedCardState };
export type { SectionedCardInteractiveProps };
