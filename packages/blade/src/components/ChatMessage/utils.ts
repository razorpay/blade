import { chatMessageToken } from './token';
import type { ColorSchemeNames } from '~tokens/theme';

const getMessageBubbleBoxShadow = (colorScheme: ColorSchemeNames): { boxShadow: string } => {
  const { boxShadow, boxShadowColor } = chatMessageToken.messageBubble;
  return { boxShadow: `${boxShadow} ${boxShadowColor[colorScheme]}` };
};

export { getMessageBubbleBoxShadow };
