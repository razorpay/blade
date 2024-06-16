import { jsxValue } from '../../utils/attributes';
import { component } from '../../utils/component';
import { findIconByLayerName } from '../../utils/findIconByLayerName';
import { bladeImports } from '../../utils/imports';
import { defaultValues } from './constants';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { BladeComponentInstanceNode, BladeProps } from '~/code/types/Blade';

export const transformIconButton = (
  bladeComponentInstance: BladeComponentInstanceNode,
): TransformFunctionReturnType => {
  const componentProperties = bladeComponentInstance.componentProperties;

  const props: BladeProps = {
    icon: {
      value: findIconByLayerName(bladeComponentInstance, 'Icon (change here)') ?? '',
      type: 'instance',
    },
    // TODO figure out why figma sizes are in pixel and
    // not props like "medium", "small"
    size: {
      value: jsxValue(componentProperties.size?.value).toLowerCase(),
      type: 'string',
    },
    contrast: {
      value: jsxValue(componentProperties.contrast?.value).toLowerCase(),
      type: 'string',
    },
  };

  return {
    component: component('IconButton', { props, defaultValues }),
    imports: bladeImports(['IconButton']),
  };
};
