import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { isPresent } from '../../utils/isPresent';
import { findTextByLayerName } from '../../utils/findTextByLayerName';
import { bladeImports } from '../../utils/imports';
import { defaultValues } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { BladeComponentInstanceNode, BladeProps } from '~/code/types/Blade';

export const transformRadio = (
  bladeInstance: BladeComponentInstanceNode,
): TransformFunctionReturnType => {
  const children = findTextByLayerName(bladeInstance, 'Label') ?? '';

  const isHelpTextPresent = isPresent(bladeInstance.componentProperties.helpText?.value);

  let helpText = '';
  if (isHelpTextPresent) {
    helpText = findTextByLayerName(bladeInstance, 'Help Text') ?? '';
  }

  const size = jsxValue(bladeInstance.componentProperties.size?.value).toLowerCase();

  const props: BladeProps = {
    size: {
      type: 'string',
      value: size,
    },
    helpText: {
      value: helpText,
      type: 'string',
    },
  };
  return {
    component: component('Radio', {
      props,
      defaultValues,
      children,
    }),
    imports: bladeImports(['Radio']),
  };
};
