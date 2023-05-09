import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { isPresent } from '../../utils/isPresent';
import { findTextByLayerName } from '../../utils/findTextByLayerName';
import { bladeImports } from '../../utils/imports';
import { defaultValues } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { BladeComponentInstanceNode, BladeProps } from '~/code/types/Blade';

export const transformSelectInput = (
  bladeComponentInstance: BladeComponentInstanceNode,
): TransformFunctionReturnType => {
  const componentProperties = bladeComponentInstance.componentProperties;

  const isHelpTextPresent = isPresent(componentProperties.helpText?.value);

  // TODO figma has option for leading icon
  // figure out how suffix and prefix icons work
  const props: BladeProps = {
    labelPosition: {
      value: jsxValue(componentProperties.labelPosition?.value).toLowerCase(),
      type: 'string',
    },
  };

  props.label = {
    value: findTextByLayerName(bladeComponentInstance, 'Label') ?? '',
    type: 'string',
  };

  if (isHelpTextPresent) {
    props.helpText = {
      value: findTextByLayerName(bladeComponentInstance, 'Help Text') ?? '',
      type: 'string',
    };
  }

  return {
    component: component('SelectInput', { props, defaultValues }),
    imports: bladeImports(['SelectInput']),
  };
};
