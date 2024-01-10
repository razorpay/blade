import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { isPresent } from '../../utils/isPresent';
import { findTextByLayerName } from '../../utils/findTextByLayerName';
import { bladeImports } from '../../utils/imports';
import { defaultValues, helpers } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { BladeComponentInstanceNode, BladeProps } from '~/code/types/Blade';

export const transformTextInput = (
  bladeComponentInstance: BladeComponentInstanceNode,
): TransformFunctionReturnType => {
  const componentProperties = bladeComponentInstance.componentProperties;

  const isHelpTextPresent = isPresent(componentProperties.helpText?.value);

  // TODO handle icon
  // const isIconPresent = isPresent(componentProperties.icon?.value);

  const isMaxCharactersPresent = isPresent(componentProperties.maxCharacters?.value);
  const isPrefixPresent = isPresent(componentProperties.prefix?.value);
  const isSuffixPresent = isPresent(componentProperties.prefix?.value);

  const props: BladeProps = {
    labelPosition: {
      value: jsxValue(componentProperties.labelPosition?.value).toLowerCase(),
      type: 'string',
    },
    showClearButton: {
      value: jsxValue(componentProperties.showClearButton?.value),
      type: 'boolean',
    },
  };

  props.label = {
    value: findTextByLayerName(bladeComponentInstance, 'Label') ?? '',
    type: 'string',
  };

  props.placeholder = {
    value: findTextByLayerName(bladeComponentInstance, 'Placeholder') ?? '',
    type: 'string',
  };

  if (isHelpTextPresent) {
    props.helpText = {
      value: findTextByLayerName(bladeComponentInstance, 'Help Text') ?? '',
      type: 'string',
    };
  }

  if (isMaxCharactersPresent) {
    const maxCharactersCountSplit = (
      findTextByLayerName(bladeComponentInstance, 'Char Count') ?? ''
    ).split('/');

    props.maxCharacters = {
      value: maxCharactersCountSplit.length > 1 ? maxCharactersCountSplit[1] : '',
      type: 'number',
    };
  }

  if (isSuffixPresent) {
    props.suffix = {
      value: findTextByLayerName(bladeComponentInstance, 'Trailing Label') ?? '',
      type: 'string',
    };
  }

  if (isPrefixPresent) {
    props.prefix = {
      value: findTextByLayerName(bladeComponentInstance, 'Leading Label') ?? '',
      type: 'string',
    };
  }

  return {
    component: component('TextInput', { props, defaultValues, helpers }),
    imports: bladeImports(['TextInput']),
  };
};
