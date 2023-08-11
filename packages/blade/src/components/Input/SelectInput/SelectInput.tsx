import React from 'react';
import isEmpty from 'lodash/isEmpty';
import { BaseInput } from '../BaseInput';
import type { BaseInputProps } from '../BaseInput';
import { SelectChevronIcon } from './SelectChevronIcon';
import { useDropdown } from '~components/Dropdown/useDropdown';
import type { IconComponent } from '~components/Icons';
import BaseBox from '~components/Box/BaseBox';
import { VisuallyHidden } from '~components/VisuallyHidden';
import { isReactNative, makeMotionTime, useTheme } from '~utils';
import { getActionListContainerRole } from '~components/ActionList/getA11yRoles';
import { componentIds } from '~components/Dropdown/dropdownUtils';
import { Tag } from '~components/Tag';
import type { BladeElementRef } from '~utils/types';
import { useBladeInnerRef } from '~utils/useBladeInnerRef';
import { MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import styled, { css, FlattenSimpleInterpolation, keyframes } from 'styled-components';

// https: codesandbox.io/s/kind-cannon-4xg4lt?file=/src/App.js:935-968

const tagDissappearKeyframe = keyframes`
  100% {
    opacity: 1;
    max-width: 140px;
  }

  100% {
    opacity: 0;
    max-width: 0px;
  }
`;

const tagShowKeyframe = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`;

const AnimatedTagContainer = styled(BaseBox)<{
  transition: FlattenSimpleInterpolation;
}>(
  (props) => css`
    ${props.transition};
    display: inline-block;
    max-width: 140px;
  `,
);

const TagWithAnimation = ({
  selectedIndex,
  tagIndex,
}: {
  selectedIndex: number;
  tagIndex: number;
}) => {
  const [isTagVisible, setIsTagVisible] = React.useState(true);
  const {
    isTagDismissedRef,
    setChangeCallbackTriggerer,
    removeOption,
    options,
    activeTagIndex,
    selectedIndices,
    changeCallbackTriggerer,
  } = useDropdown();
  const { theme } = useTheme();
  const prevSelectionsLength = React.useRef<number>();

  const hideTagTransition = css`
    animation: ${tagDissappearKeyframe} ${makeMotionTime(theme.motion.duration.xquick)}
      ${String(theme.motion.easing.exit.effective)};
  `;

  const showTagTransition = css`
    animation: ${tagShowKeyframe} ${makeMotionTime(theme.motion.duration.xquick)}
      ${String(theme.motion.easing.entrance.effective)};
  `;

  const noTransition = css`
    animation: none;
  `;

  const isTagRemoved = prevSelectionsLength.current
    ? prevSelectionsLength.current > selectedIndices.length
    : false;

  return (
    <AnimatedTagContainer
      style={{ opacity: isTagVisible ? 1 : 0 }}
      onAnimationEnd={() => {
        if (!isTagVisible) {
          if (isTagDismissedRef.current) {
            isTagDismissedRef.current.value = true;
          }

          removeOption(selectedIndex);
          setIsTagVisible(true);
          setChangeCallbackTriggerer(Number(changeCallbackTriggerer) + 1);
        }
      }}
      transition={
        isTagRemoved ? noTransition : isTagVisible ? showTagTransition : hideTagTransition
      }
    >
      <Tag
        _isVirtuallyFocussed={tagIndex === activeTagIndex}
        _isTagInsideInput={true}
        key={selectedIndex}
        marginRight="spacing.3"
        marginY="spacing.2"
        onDismiss={() => {
          prevSelectionsLength.current = selectedIndices.length;
          setIsTagVisible(false);
        }}
      >
        {options[selectedIndex].title}
      </Tag>
    </AnimatedTagContainer>
  );
};

type SelectInputCommonProps = Pick<
  BaseInputProps,
  | 'label'
  | 'accessibilityLabel'
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

/*
  Mandatory accessibilityLabel prop when label is not provided
*/
type SelectInputPropsWithA11yLabel = {
  /**
   * Label to be shown for the input field
   */
  label?: undefined;
  /**
   * Accessibility label for the input
   */
  accessibilityLabel: string;
};

/*
  Optional accessibilityLabel prop when label is provided
*/
type SelectInputPropsWithLabel = {
  /**
   * Label to be shown for the input field
   */
  label: string;
  /**
   * Accessibility label for the input
   */
  accessibilityLabel?: string;
};

type SelectInputProps = (SelectInputPropsWithA11yLabel | SelectInputPropsWithLabel) &
  SelectInputCommonProps;

const _SelectInput = (
  props: SelectInputProps,
  ref: React.ForwardedRef<BladeElementRef>,
): React.ReactElement => {
  const {
    isOpen,
    value,
    displayValue,
    onTriggerClick,
    onTriggerKeydown,
    dropdownBaseId,
    activeIndex,
    activeTagIndex,
    setActiveTagIndex,
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
    isControlled,
    setIsControlled,
    selectionType,
    selectedIndices,
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

    const tags = selectedIndices.map((selectedIndex, tagIndex) => (
      <TagWithAnimation key={selectedIndex} selectedIndex={selectedIndex} tagIndex={tagIndex} />
    ));

    return tags;
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <BaseBox position="relative">
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
        tagRows={props.rows}
        tags={getTags()}
        showAllTags={isOpen}
        activeTagIndex={activeTagIndex}
        setActiveTagIndex={setActiveTagIndex}
        value={selectionType === 'multiple' ? undefined : displayValue}
        label={props.label as string}
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
            isOpen={isOpen}
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
