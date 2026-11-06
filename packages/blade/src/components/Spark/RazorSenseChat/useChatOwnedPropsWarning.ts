import { useEffect } from 'react';
import type { RazorSenseDrawProps } from '../RazorSenseEngine/drawProps';
import { logger } from '~utils/logger';

/** what RazorSenseChat takes over from the parts inside it (it draws them, on its own canvas) */
const CHAT_OWNED = ['scale', 'isPaused', 'onLoad', 'onError'] as const;

/**
 * Inside a RazorSenseChat, RazorSenseThinking and RazorSenseBottomWave only mark where the chat draws: their own `scale`,
 * `isPaused`, `onLoad` and `onError` don't apply (the chat's do). Says so in development, once per change, when any of them is
 * set there.
 */
const useChatOwnedPropsWarning = (
  moduleName: string,
  isInChat: boolean,
  props: Pick<RazorSenseDrawProps, typeof CHAT_OWNED[number]>,
): void => {
  const given = CHAT_OWNED.filter((name) => props[name] !== undefined);
  const list = given.join(', ');
  useEffect(() => {
    if (!__DEV__ || !isInChat || !list) return;
    logger({
      type: 'warn',
      moduleName,
      message: `Inside RazorSenseChat the chat draws it, so its own ${list} ${
        given.length === 1 ? "doesn't" : "don't"
      } apply: set ${given.length === 1 ? 'it' : 'them'} on RazorSenseChat instead.`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleName, isInChat, list]);
};

export { useChatOwnedPropsWarning };
