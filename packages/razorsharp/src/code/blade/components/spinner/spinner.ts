import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { isPresent } from '../../utils/isPresent';
import { findTextByLayerName } from '../../utils/findTextByLayerName';
import { bladeImports } from '../../utils/imports';
import { defaultValues } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { BladeComponentInstanceNode, BladeProps } from '~/code/types/Blade';

export const transformSpinner = (
  bladeInstance: BladeComponentInstanceNode,
): TransformFunctionReturnType => {
  const props: BladeProps = {};

  const componentProperties = bladeInstance.componentProperties;

  props.size = {
    value: jsxValue(componentProperties.size?.value).toLowerCase(),
    type: 'string',
  };

  props.contrast = {
    value: jsxValue(componentProperties.contrast?.value).toLowerCase(),
    type: 'string',
  };

  const isLabelPresent = isPresent(componentProperties.label?.value);
  if (isLabelPresent) {
    props.label = {
      value: findTextByLayerName(bladeInstance, 'Label') ?? '',
      type: 'string',
    };

    props.labelPosition = {
      value: props.size.value === 'medium' ? 'right' : 'bottom',
      type: 'string',
    };
  }

  return {
    component: component('Spinner', {
      props,
      defaultValues,
    }),
    imports: bladeImports(['Spinner']),
  };
};
