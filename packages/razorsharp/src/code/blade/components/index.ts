import { isIconInstance } from '../utils/iconUtils';
import { transformAlert } from './alert';
import { transformBadge } from './badge';
// eslint-disable-next-line import/no-cycle
import { transformFrameOrGroup } from './box';
import { transformButton } from './button';
import { transformCheckbox, transformCheckboxGroup } from './checkbox';
import { transformCounter } from './counter';
import { transformIcon } from './icon';
import { transformIconButton } from './iconButton';
import { transformIndicator } from './indicator';
import {
  transformOtpInput,
  transformPasswordInput,
  transformSelectInput,
  transformTextArea,
  transformTextInput,
} from './input';
import { transformLink } from './link';
import { transformProgressBar } from './progressBar';
import { transformRadio, transformRadioGroup } from './radio';
import { transformSpinner } from './spinner';
import {
  transformTitle,
  transformHeading,
  transformText,
  transformCode,
  transformTextNode,
} from './typography';
import type { TransformFunctionReturnType } from '~/code/types/TransformFunction';
import type {
  BladeComponentInstanceNode,
  BladeFrameNode,
  BladeGroupNode,
  BladeTextNode,
} from '~/code/types/Blade';

const getUnknownComponentOutput = (
  component: BladeComponentInstanceNode,
): TransformFunctionReturnType => {
  return {
    component: `
  {/* 
    ${component.name} is either not supported yet or not a part of Blade.
    <${component.name} /> 
  */}`,
    imports: {},
  };
};

export const generateBladeComponentInstanceCode = (
  bladeComponentInstance: BladeComponentInstanceNode,
): TransformFunctionReturnType => {
  // check if component instance is an icon
  const isIcon = isIconInstance(bladeComponentInstance);
  if (isIcon) return transformIcon(bladeComponentInstance);

  // handle all other components
  switch (bladeComponentInstance.name) {
    case 'Button':
      return transformButton(bladeComponentInstance);
    case 'Text Input':
      return transformTextInput(bladeComponentInstance);
    case 'Badge':
      return transformBadge(bladeComponentInstance);
    case 'Link':
      return transformLink(bladeComponentInstance);
    case 'Checkbox':
      return transformCheckbox(bladeComponentInstance);
    case 'Title':
      return transformTitle(bladeComponentInstance);
    case 'Heading':
      return transformHeading(bladeComponentInstance);
    case 'Text':
      return transformText(bladeComponentInstance);
    case 'Code':
      return transformCode(bladeComponentInstance);
    case 'Radio-Button':
      return transformRadio(bladeComponentInstance);
    case 'Checkbox-Group':
      return transformCheckboxGroup(bladeComponentInstance);
    case 'Radio-Group':
      return transformRadioGroup(bladeComponentInstance);
    case 'Alert':
      return transformAlert(bladeComponentInstance);
    case 'Spinner':
      return transformSpinner(bladeComponentInstance);
    case 'TextArea Input':
      return transformTextArea(bladeComponentInstance);
    case 'Password Input':
      return transformPasswordInput(bladeComponentInstance);
    case 'OTP Input':
      return transformOtpInput(bladeComponentInstance);
    case 'Counter':
      return transformCounter(bladeComponentInstance);
    case 'IconButton':
      return transformIconButton(bladeComponentInstance);
    case 'Indicators':
      return transformIndicator(bladeComponentInstance);
    case 'ProgressBar':
      return transformProgressBar(bladeComponentInstance);
    case 'Select Input':
      return transformSelectInput(bladeComponentInstance);
    default:
      return getUnknownComponentOutput(bladeComponentInstance);
  }
};

export const generateBladeFrameCode = (bladeNode: BladeFrameNode): TransformFunctionReturnType => {
  return transformFrameOrGroup(bladeNode);
};

export const generateTextNodeCode = (bladeNode: BladeTextNode): TransformFunctionReturnType => {
  return transformTextNode(bladeNode);
};

export const generateGroupNodeCode = (bladeNode: BladeGroupNode): TransformFunctionReturnType => {
  return transformFrameOrGroup(bladeNode);
};
