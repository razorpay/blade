import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { findTextByLayerName } from '../../utils/findTextByLayerName';
import { bladeImports } from '../../utils/imports';
import { defaultValues } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { BladeComponentInstanceNode, BladeProps } from '~/code/types/Blade';

export const transformProgressBar = (
  bladeComponentInstance: BladeComponentInstanceNode,
): TransformFunctionReturnType => {
  const componentProperties = bladeComponentInstance.componentProperties;

  const intent = jsxValue(componentProperties.intent?.value).toLowerCase();
  const size = jsxValue(componentProperties.size?.value).toLowerCase();

  const props: BladeProps = {
    // TODO figma has "none" as a value for intent, but we don't have that in blade
    intent: {
      value: intent === 'none' ? 'neutral' : intent,
      type: 'string',
    },
    // TODO figma sizes don't match blade sizes
    size: {
      value: size === 'large' ? 'medium' : size,
      type: 'string',
    },
    contrast: {
      value: jsxValue(componentProperties.contrast?.value).toLowerCase(),
      type: 'string',
    },
    isIndeterminate: {
      value: jsxValue(componentProperties.isIndeterminate?.value).toLowerCase(),
      type: 'boolean',
    },
    showPercentage: {
      value: jsxValue(componentProperties.showPercentage?.value).toLowerCase(),
      type: 'boolean',
    },
    label: {
      type: 'string',
      value: findTextByLayerName(bladeComponentInstance, 'Label') ?? '',
    },
  };

  return {
    component: component('ProgressBar', { props, defaultValues }),
    imports: bladeImports(['ProgressBar']),
  };
};
