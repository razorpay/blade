import React from 'react';
import type { TextInput as TextInputReactNative } from 'react-native';

type NativeHTMLInputRefProps = Omit<HTMLInputElement, keyof HTMLElement> & {
  focus: HTMLElement['focus'];
};

/**
 * A hook which only exposes the properties of html input element via imparative hook
 *
 * It avoids exposing other native properties of HTMLElement
 * like `style` `classList` to avoid unintended usage of refs.
 */
const useExposeInputRef = (
  targetRef: React.ForwardedRef<NativeHTMLInputRefProps>,
  inputRef: React.RefObject<TextInputReactNative | HTMLInputElement>,
) => {
  React.useImperativeHandle(
    targetRef,
    (): NativeHTMLInputRefProps => {
      const input = inputRef.current as HTMLInputElement & {
        selectedOptions: HTMLSelectElement['selectedOptions'];
      };
      return {
        focus: (opts) => input.focus(opts),
        accept: input.accept,
        dirName: input.dirName,
        capture: input.capture,
        checked: input.checked,
        defaultChecked: input.defaultChecked,
        disabled: input.disabled,
        readOnly: input.readOnly,
        required: input.required,
        formTarget: input.formTarget,
        formAction: input.formAction,
        formEnctype: input.formEnctype,
        formMethod: input.formMethod,
        formNoValidate: input.formNoValidate,
        indeterminate: input.indeterminate,
        list: input.list,
        min: input.min,
        max: input.max,
        minLength: input.minLength,
        maxLength: input.maxLength,
        multiple: input.multiple,
        pattern: input.pattern,
        name: input.name,
        placeholder: input.placeholder,
        selectionDirection: input.selectionDirection,
        selectionEnd: input.selectionEnd,
        selectionStart: input.selectionStart,
        selectedOptions: input.selectedOptions,
        step: input.step,
        type: input.type,
        validationMessage: input.validationMessage,
        validity: input.validity,
        willValidate: input.willValidate,
        value: input.value,
        defaultValue: input.defaultValue,
        valueAsDate: input.valueAsDate,
        valueAsNumber: input.valueAsNumber,
        checkValidity: () => input.checkValidity(),
        reportValidity: () => input.reportValidity(),
        select: () => input.select(),
        setCustomValidity: (err) => input.setCustomValidity(err),
        // @ts-expect-error args are incompatible because of an overload
        setRangeText: (replacement, start, end, selectionMode) =>
          input.setRangeText(replacement, start, end, selectionMode),
        setSelectionRange: (start, end, direction) =>
          input.setSelectionRange(start, end, direction),
        showPicker: () => input.showPicker(),
        stepDown: (n) => input.stepDown(n),
        stepUp: (n) => input.stepUp(n),
        // @ts-expect-error args are any because of an overload
        addEventListener: (type, listener, opts) => input.addEventListener(type, listener, opts),
        // @ts-expect-error args are any because of an overload
        removeEventListener: (type, listener, opts) =>
          input.removeEventListener(type, listener, opts),
      };
    },
    [inputRef],
  );
};

export { useExposeInputRef, NativeHTMLInputRefProps };
