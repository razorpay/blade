import type React from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { BaseInputProps } from './BaseInput';
import type { FormInputHandleOnEvent } from '~components/Form';
import type {
  FormInputHandleOnClickEvent,
  FormInputHandleOnKeyDownEvent,
  FormInputOnClickEvent,
} from '~components/Form/FormTypes';
import type { ContainerElementType } from '~utils/types';
import type { ActionStates } from '~utils/useInteraction';

export type InputWrapperRef = React.MutableRefObject<ContainerElementType | null>;

export type BaseInputTagSlotProps = {
  tags?: BaseInputProps['tags'];
  isDisabled?: BaseInputProps['isDisabled'];
  renderAs?: BaseInputProps['as'];
  showAllTags: BaseInputProps['showAllTags'];
  setFocusOnInput: () => void;
  setShouldIgnoreBlurAnimation: BaseInputProps['setShouldIgnoreBlurAnimation'];
  handleOnInputClick: (e?: FormInputOnClickEvent['value']) => void;
  maxTagRows: BaseInputProps['maxTagRows'];
  visibleTagsCountRef: React.MutableRefObject<number>;
  children: React.ReactElement;
  isDropdownTrigger: BaseInputProps['isDropdownTrigger'];
  inputWrapperRef: InputWrapperRef;
  labelPrefix?: string;
  size: NonNullable<BaseInputProps['size']>;
  isTextArea?: boolean;
  numberOfLines: BaseInputProps['numberOfLines'];
};

export type BaseInputWrapperProps = Pick<
  BaseInputProps,
  'isDisabled' | 'validationState' | 'showAllTags' | 'maxTagRows' | 'isDropdownTrigger'
> & {
  isFocused?: boolean;
  isLabelLeftPositioned?: boolean;
  currentInteraction: ActionStates;
  isTextArea?: boolean;
  setShowAllTagsWithAnimation: (showAllTagsWithAnimation: boolean) => void;
  children: React.ReactNode;
  size: NonNullable<BaseInputProps['size']>;
  numberOfLines: BaseInputProps['numberOfLines'];
  isTableInputCell: NonNullable<BaseInputProps['isTableInputCell']>;
  onClick?: (event: React.MouseEvent<HTMLInputElement>) => void;
};

export type StyledBaseInputProps = {
  handleOnFocus?: FormInputHandleOnEvent;
  handleOnChange?: FormInputHandleOnEvent;
  handleOnBlur?: FormInputHandleOnEvent;
  handleOnSubmit?: FormInputHandleOnEvent;
  handleOnKeyDown?: FormInputHandleOnKeyDownEvent;
  handleOnInput?: FormInputHandleOnEvent;
  handleOnClick?: FormInputHandleOnClickEvent;
  hasLeadingIcon?: boolean;
  hasTrailingIcon?: boolean;
  accessibilityProps: Record<string, unknown>;
  currentInteraction: ActionStates;
  setCurrentInteraction: Dispatch<SetStateAction<ActionStates>>;
  isTextArea?: boolean;
  hasTags?: boolean;
  $size: NonNullable<BaseInputProps['size']>;
  isTableInputCell: NonNullable<BaseInputProps['isTableInputCell']>;
  valueComponentType: NonNullable<BaseInputProps['valueComponentType']>;
} & Pick<
  BaseInputProps,
  | 'as'
  | 'numberOfLines'
  | 'id'
  | 'name'
  | 'type'
  | 'placeholder'
  | 'defaultValue'
  | 'value'
  | 'isDisabled'
  | 'isRequired'
  | 'validationState'
  | 'leadingIcon'
  | 'prefix'
  | 'trailingInteractionElement'
  | 'onTrailingInteractionElementClick'
  | 'leadingInteractionElement'
  | 'suffix'
  | 'trailingIcon'
  | 'maxCharacters'
  | 'textAlign'
  | 'autoFocus'
  | 'keyboardType'
  | 'keyboardReturnKeyType'
  | 'autoCompleteSuggestionType'
  | 'hasPopup'
  | 'popupId'
  | 'isPopupExpanded'
  | 'shouldIgnoreBlurAnimation'
  | 'autoCapitalize'
  | 'isDropdownTrigger'
>;

export { StyledBaseInput } from './StyledBaseInput.web';
