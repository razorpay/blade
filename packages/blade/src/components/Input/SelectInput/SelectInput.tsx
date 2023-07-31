import React from 'react';
import isEmpty from 'lodash/isEmpty';
import { BaseInput } from '../BaseInput';
import type { BaseInputProps } from '../BaseInput';
import { SelectChevronIcon } from './SelectChevronIcon';
import { ChevronDownIcon, ChevronUpIcon } from '~components/Icons';
import { useDropdown } from '~components/Dropdown/useDropdown';
import type { IconComponent } from '~components/Icons';
import BaseBox from '~components/Box/BaseBox';
import { VisuallyHidden } from '~components/VisuallyHidden';
import { isReactNative } from '~utils';
import { getActionListContainerRole } from '~components/ActionList/getA11yRoles';
import { componentIds } from '~components/Dropdown/dropdownUtils';
import { Tag } from '~components/Tag';
import type { BladeElementRef } from '~utils/types';
import { useBladeInnerRef } from '~utils/useBladeInnerRef';
import { MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { Text } from '~components/Typography';

type SelectInputProps = Pick<
  BaseInputProps,
  | 'label'
  | 'labelPosition'
  | 'necessityIndicator'
  | 'validationState'
  | 'helpText'
  | 'errorText'
  | 'successText'
  | 'name'
  | 'isDisabled'
  | 'isRequired'
  | 'prefix'
  | 'suffix'
  | 'autoFocus'
  | 'onClick'
  | 'onFocus'
  | 'onBlur'
  | 'placeholder'
  | 'testID'
> & {
  icon?: IconComponent;
  /**
   * Controlled value of the Select. Use it in combination of `onChange`.
   *
   * Check out [Controlled Dropdown Documentation](https://blade.razorpay.com/?path=/story/components-dropdown-with-select--controlled-dropdown&globals=measureEnabled:false) for example.
   */
  value?: string | string[];
  /**
   * Used to set the default value of SelectInput when it's uncontrolled. Use `value` instead for controlled SelectInput
   */
  defaultValue?: string | string[];
  onChange?: ({ name, values }: { name?: string; values: string[] }) => void;
  /**
   * constraints the height of input to given number rows
   *
   * When set to expandable, input takes 1 row in the begining and expands to take 3 when active
   *
   * @default 1
   */
  rows?: '1' | '3' | 'expandable';
};

const _SelectInput = (
  props: SelectInputProps,
  ref: React.ForwardedRef<BladeElementRef>,
): JSX.Element => {
  const {
    isOpen,
    value,
    displayValue,
    onTriggerClick,
    onTriggerKeydown,
    dropdownBaseId,
    activeIndex,
    activeTagIndex,
    visibleTagsCountRef,
    triggererRef,
    hasFooterAction,
    dropdownTriggerer,
    shouldIgnoreBlurAnimation,
    setHasLabelOnLeft,
    setSelectedIndices,
    setShouldIgnoreBlurAnimation,
    controlledValueIndices,
    options,
    changeCallbackTriggerer,
    setChangeCallbackTriggerer,
    isControlled,
    setIsControlled,
    selectionType,
    selectedIndices,
    removeOption,
    isTagDismissedRef,
  } = useDropdown();

  const inputRef = useBladeInnerRef(ref, {
    onFocus: (opts) => {
      triggererRef.current?.focus(opts);
    },
  });

  const {
    icon,
    onChange,
    defaultValue,
    placeholder = 'Select Option',
    onBlur,
    ...baseInputProps
  } = props;

  const getValuesArrayFromIndices = (): string[] => {
    let indices: number[] = [];
    if (isControlled) {
      indices = controlledValueIndices;
    } else {
      indices = selectedIndices;
    }

    return indices.map((selectionIndex) => options[selectionIndex].value);
  };

  const isFirstRenderRef = React.useRef(true);
  const selectInputContainerRef = React.useRef<HTMLDivElement>(null);

  const selectValues = (valuesToSelect: string | string[]): void => {
    if (options.length > 0) {
      // we use empty `''` for clearing the input
      if (isEmpty(valuesToSelect)) {
        setSelectedIndices([]);
      } else if (typeof valuesToSelect === 'string') {
        // single select control
        const selectedItemIndex = options.findIndex((option) => option.value === valuesToSelect);
        if (selectedItemIndex >= 0) {
          setSelectedIndices([selectedItemIndex]);
        }
      } else {
        // multiselect control

        // Handles repeated values in user state
        const uniqueValues = Array.from(new Set(valuesToSelect));
        // Handle selectionType single with multiselect values
        const userValues = selectionType === 'single' ? [valuesToSelect?.[0]] : uniqueValues;

        const selectedItemIndices = userValues
          .map((optionValue) => options.findIndex((option) => option.value === optionValue))
          .filter((value) => value >= 0);

        setSelectedIndices(selectedItemIndices);
      }
    }
  };

  // Handles `defaultValue` prop
  React.useEffect(() => {
    if (options.length > 0 && props.defaultValue) {
      selectValues(props.defaultValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.length]);

  // Handles `value` prop
  React.useEffect(() => {
    if (options.length > 0 && props.value !== undefined) {
      if (!isControlled) {
        setIsControlled(true);
      }

      selectValues(props.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value, options]);

  React.useEffect(() => {
    // Ignore calling onChange on mount
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }

    if (props.onChange && !isFirstRenderRef.current) {
      props.onChange({
        name: props.name,
        values: getValuesArrayFromIndices(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeCallbackTriggerer]);

  React.useEffect(() => {
    setHasLabelOnLeft(props.labelPosition === 'left');
  }, [props.labelPosition, setHasLabelOnLeft]);

  const getTags = (): React.ReactElement[] | null => {
    if (selectionType === 'single') {
      return null;
    }

    let stripAfter = 0;

    if (isOpen || props.rows === '3') {
      stripAfter = selectedIndices.length;
    } else {
      // eslint-disable-next-line no-lonely-if
      if (selectInputContainerRef.current?.clientWidth) {
        const leadingTrailingBoxWidth = 72; // 36px + 36px;
        const maxWidthTag = 140 + 8; // 140px width + 8px gap between tags
        const spaceForTags = selectInputContainerRef.current?.clientWidth - leadingTrailingBoxWidth;
        const tagsCanFit = spaceForTags / maxWidthTag;
        stripAfter = Math.floor(tagsCanFit);
      } else {
        stripAfter = 2; // defaulting to strip after 2 tags if clientWidth is not present for some reason
      }

      // console.log(selectInputContainerRef.current?.clientHeight);

      // if (props.rows === '3') {
      //   stripAfter = stripAfter * 4; // In multiline, tags can take upto 3 rows
      // }
    }

    if (typeof visibleTagsCountRef.current?.value === 'number') {
      visibleTagsCountRef.current.value = Math.min(stripAfter, selectedIndices.length);
    }

    const tags = selectedIndices.slice(0, stripAfter).map((selectedIndex, tagIndex) => (
      <Tag
        _isVirtuallyFocussed={tagIndex === activeTagIndex}
        _isTagInsideInput={true}
        key={selectedIndex}
        marginRight="spacing.3"
        marginY="spacing.2"
        onDismiss={() => {
          if (isTagDismissedRef.current) {
            isTagDismissedRef.current.value = true;
          }
          removeOption(selectedIndex);
          setChangeCallbackTriggerer(Number(changeCallbackTriggerer) + 1);
        }}
      >
        {options[selectedIndex].title}
      </Tag>
    ));

    const plusMoreText =
      selectedIndices.length > stripAfter ? (
        <Text key="plus" alignSelf="center">
          +{selectedIndices.length - stripAfter} More
        </Text>
      ) : null;

    if (plusMoreText) {
      return [...tags, plusMoreText];
    }

    return tags;
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <BaseBox position="relative" ref={selectInputContainerRef as any}>
      {!isReactNative() ? (
        <VisuallyHidden>
          <input
            ref={inputRef as React.Ref<HTMLInputElement>}
            tabIndex={-1}
            required={props.isRequired}
            name={props.name}
            value={value}
            // Adding onChange to surpass no onChange on controlled component warning
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onChange={() => {}}
            // Accessibility is covered in the select input itself so we hide this field from a11y tree
            aria-hidden={true}
          />
        </VisuallyHidden>
      ) : null}
      <BaseInput
        {...baseInputProps}
        as="button"
        isMultiline={props.rows === '3' || props.rows === 'expandable'}
        tags={getTags()}
        value={selectionType === 'multiple' ? undefined : displayValue}
        hideLabelText={props.label?.length === 0}
        componentName={MetaConstants.SelectInput}
        ref={!isReactNative() ? (triggererRef as React.MutableRefObject<HTMLInputElement>) : null}
        textAlign="left"
        placeholder={
          selectionType === 'multiple' && selectedIndices.length > 0 ? undefined : placeholder
        }
        id={`${dropdownBaseId}-trigger`}
        labelId={`${dropdownBaseId}-label`}
        leadingIcon={icon}
        hasPopup={getActionListContainerRole(hasFooterAction, dropdownTriggerer)}
        isPopupExpanded={isOpen}
        onClick={(e) => {
          onTriggerClick();
          props?.onClick?.(e);
        }}
        onKeyDown={onTriggerKeydown}
        activeDescendant={activeIndex >= 0 ? `${dropdownBaseId}-${activeIndex}` : undefined}
        popupId={`${dropdownBaseId}-actionlist`}
        shouldIgnoreBlurAnimation={shouldIgnoreBlurAnimation}
        setShouldIgnoreBlurAnimation={setShouldIgnoreBlurAnimation}
        interactionElement={
          <SelectChevronIcon
            onClick={() => {
              if (!props.isDisabled) {
                // Icon onClicks to the SelectInput itself
                if (!isReactNative()) {
                  triggererRef.current?.focus();
                }
                onTriggerClick();
              }
            }}
            icon={isOpen ? ChevronUpIcon : ChevronDownIcon}
          />
        }
        testID={props.testID}
      />
    </BaseBox>
  );
};

/**
 * ### SelectInput
 *
 * Our equivalent of `<select>` tag. Lets you select items from given options.
 *
 * To be used in combination of `Dropdown` and `ActionList` component
 *
 * ---
 *
 * #### Usage
 *
 * ```diff
 * <Dropdown>
 * + <SelectInput label="Select Fruits" />
 *   <DropdownOverlay>
 *     <ActionList>
 *       <ActionListItem title="Mango" value="mango" />
 *       <ActionListItem title="Apple" value="apple" />
 *     </ActionList>
 *   </DropdownOverlay>
 * </Dropdown>
 * ```
 *
 * ---
 *
 * Checkout {@link https://blade.razorpay.com/?path=/docs/components-dropdown-with-select--with-single-select SelectInput Documentation}.
 */

const SelectInput = assignWithoutSideEffects(React.forwardRef(_SelectInput), {
  componentId: componentIds.triggers.SelectInput,
});

export { SelectInput, SelectInputProps };
