import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { findTextByLayerName } from '../../utils/findTextByLayerName';
import { bladeImports } from '../../utils/imports';
import { defaultValues } from './constants';
import { getLinkIconProps } from './utils';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { BladeComponentInstanceNode, BladeProps } from '~/code/types/Blade';

export const transformLink = (
  bladeInstance: BladeComponentInstanceNode,
): TransformFunctionReturnType => {
  const size = jsxValue(bladeInstance.componentProperties.size?.value).toLowerCase();

  const { icon, iconPosition } = getLinkIconProps(bladeInstance);

  const children = findTextByLayerName(bladeInstance, 'Text') ?? '';

  const props: BladeProps = {
    size: {
      type: 'string',
      value: size,
    },
    icon: {
      value: icon,
      type: 'instance',
    },
    iconPosition: {
      value: iconPosition,
      type: 'string',
    },
  };

  return {
    component: component('Link', {
      props,
      defaultValues,
      children,
    }),
    imports: bladeImports(['Link']),
  };
};
