import type { ColorSchemeNames } from '~tokens/theme';
import { chatMessageToken } from './token';

const getMessageBubbleBoxShadow = (colorScheme: ColorSchemeNames): { boxShadow: string } => {
  const { boxShadow, boxShadowColor } = chatMessageToken.messageBubble;
  return { boxShadow: `${boxShadow} ${boxShadowColor[colorScheme]}` };
};

export { getMessageBubbleBoxShadow };
