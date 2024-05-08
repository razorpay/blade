// eslint-disable-next-line import/no-cycle
import { generateBladeCode } from '../../main';
import { convertStyleNameToBladeName, isBackgroundColorToken } from '../../utils/color';
import { component } from '../../utils/component';
import { bladeImports, mergeImports } from '../../utils/imports';
import { getPaddingValue, getTokenFromSpacingValue } from '../../utils/spacing';
import { defaultValues, LAYOUT_MODES } from './constants';
import { getFlexAlignmentFromAxisAlignment } from './utils';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type { BladeFrameNode, BladeGroupNode, BladeProps } from '~/code/types/Blade';

export const transformFrameOrGroup = (
  bladeFrame: BladeFrameNode | BladeGroupNode,
): TransformFunctionReturnType => {
  const props: BladeProps = {};

  // TODO groups can have item spacing as well
  // since item spacing figma property does not exist
  // for groups, use relative transform matrix to find the
  // distances between elements in a group
  if (bladeFrame.type === 'GROUP') {
    let children: TransformFunctionReturnType = { component: '', imports: {} };
    if (bladeFrame.children && bladeFrame.children.length > 0) {
      children = generateBladeCode({
        bladeNodes: bladeFrame.children,
      });
    }

    return {
      component: component('Box', {
        props,
        defaultValues,
        children: children.component,
      }),
      imports: mergeImports(children.imports ?? {}, bladeImports(['Box'])),
    };
  }

  // --- Frame specific code below ---
  // --- Layout mode specific code below ---
  // TODO set alignItems and justifyContent when items don't fill the entire space
  if (
    bladeFrame.layoutMode === LAYOUT_MODES.VERTICAL ||
    bladeFrame.layoutMode === LAYOUT_MODES.HORIZONTAL
  ) {
    props.display = {
      value: 'flex',
      type: 'string',
    };

    props.flexDirection = {
      value: bladeFrame.layoutMode === 'VERTICAL' ? 'column' : 'row',
      type: 'string',
    };

    props.gap = {
      value: getTokenFromSpacingValue(bladeFrame.itemSpacing),
      type: 'string',
    };

    const justifyContent = getFlexAlignmentFromAxisAlignment(bladeFrame.primaryAxisAlignItems);
    const alignItems = getFlexAlignmentFromAxisAlignment(bladeFrame.counterAxisAlignItems);

    props.justifyContent = { value: justifyContent, type: 'string' };
    props.alignItems = { value: alignItems, type: 'string' };

    const paddingValue = getPaddingValue({
      top: bladeFrame.paddingTop,
      right: bladeFrame.paddingRight,
      bottom: bladeFrame.paddingBottom,
      left: bladeFrame.paddingLeft,
    });
    // always generate an array. easier to generate this syntax
    // since it works in all cases
    props.padding = {
      value:
        paddingValue.length > 1
          ? `[${paddingValue.map((value) => `"${value}"`).join(', ')}]`
          : paddingValue[0],
      type: paddingValue.length > 1 ? 'instance' : 'string',
    };

    if (bladeFrame.maxHeight) {
      props.maxHeight = {
        value: getTokenFromSpacingValue(bladeFrame.maxHeight),
        type: 'string',
      };
    }

    if (bladeFrame.maxWidth) {
      props.maxWidth = {
        value: getTokenFromSpacingValue(bladeFrame.maxWidth),
        type: 'string',
      };
    }

    if (bladeFrame.layoutSizingVertical === 'FIXED') {
      props.height = {
        value: getTokenFromSpacingValue(bladeFrame.height),
        type: 'string',
      };
    }

    if (bladeFrame.layoutSizingHorizontal === 'FIXED') {
      props.width = {
        value: getTokenFromSpacingValue(bladeFrame.width),
        type: 'string',
      };
    }

    if (
      (bladeFrame.layoutSizingVertical === 'FILL' &&
        bladeFrame.layoutMode === LAYOUT_MODES.VERTICAL) ||
      (bladeFrame.layoutSizingHorizontal === 'FILL' &&
        bladeFrame.layoutMode === LAYOUT_MODES.HORIZONTAL)
    ) {
      props.flex = {
        value: '1',
        type: 'string',
      };
    }
  }
  // --- Layout mode specific end ---

  // TODO add support for fills array
  // TODO handle figma.mixed
  // --- Background color ---
  if (bladeFrame.fillStyleId !== figma.mixed) {
    const fillStyle = figma.getStyleById(bladeFrame.fillStyleId);
    if (fillStyle) {
      const styleName = fillStyle.name;
      const bladeTokenName = convertStyleNameToBladeName(styleName);
      const isValidToken = isBackgroundColorToken(bladeTokenName);

      props.backgroundColor = {
        value: bladeTokenName,
        type: 'string',
        isCommented: !isValidToken,
        comment: isValidToken
          ? ''
          : 'Only surface.background tokens are supported by Box component',
      };
    }
  }

  let children: TransformFunctionReturnType = { component: '', imports: {} };
  if (bladeFrame.children && bladeFrame.children.length > 0) {
    children = generateBladeCode({
      bladeNodes: bladeFrame.children,
    });
  }

  return {
    component: component('Box', {
      props,
      defaultValues,
      children: children.component,
    }),
    imports: mergeImports(children.imports ?? {}, bladeImports(['Box'])),
  };
};
