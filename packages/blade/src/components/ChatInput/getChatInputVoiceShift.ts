import type { ChatInputStatus } from './types';
import type { Theme } from '~components/BladeProvider';
import { minHeight as buttonMinHeight } from '~components/Button/BaseButton/buttonTokens';

/**
 * How far the mic moves right to take Send's place while Send is hidden: Send's width plus the
 * 8 px gap between them. Send hides only while the request is `ready` and there is nothing to
 * send (or the input is disabled); Stop, the loader and Retry always show, so the mic stays put.
 */
const getChatInputVoiceShift = ({
  theme,
  status,
  hasContent,
  isDisabled,
  buttonSize,
}: {
  theme: Theme;
  status: ChatInputStatus;
  hasContent: boolean;
  isDisabled: boolean;
  buttonSize: 'small' | 'xsmall';
}): number => {
  const isSendHidden = status === 'ready' && (!hasContent || isDisabled);
  return isSendHidden ? buttonMinHeight[buttonSize] + theme.spacing[3] : 0;
};

export { getChatInputVoiceShift };
