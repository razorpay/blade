import React, { memo, useMemo } from 'react';
import { BaseRayChatOutput } from './RayChatOutput';
import type { GenUIComponentDefinition, GenUIComponentRenderer } from '~components/GenUI';
import { useGenUIAnimation } from '~components/GenUI/GenUIContext';
import { TextAnimationStyles } from '~components/GenUI/GenUIComponents';
import { createRehypeAnimate } from '~components/GenUI/rehypeAnimate';

/** GenUI's TEXT, drawn by RAY's chat rules. Keeps GenUI's word fade while the reply streams. */
const RayChatOutputText = memo(({ content }: { content?: string }) => {
  const { isAnimating, animateOptions } = useGenUIAnimation();
  const rehypePlugins = useMemo(() => (isAnimating ? [createRehypeAnimate(animateOptions)] : []), [
    isAnimating,
    animateOptions,
  ]);

  if (!content) return null;

  return (
    <>
      {isAnimating ? <TextAnimationStyles /> : null}
      <BaseRayChatOutput rehypePlugins={rehypePlugins}>{content}</BaseRayChatOutput>
    </>
  );
});

/**
 * Makes GenUI draw its TEXT the way RAY's chat looks. GenUI's cards and tables stay its own.
 *
 * @example
 * <GenUIProvider config={{ components: { TEXT: rayChatOutputGenUI } }}>
 *   <GenUISchemaRenderer components={reply} isAnimating={isStreaming} />
 * </GenUIProvider>
 */
const rayChatOutputGenUI: GenUIComponentDefinition = {
  renderer: RayChatOutputText as GenUIComponentRenderer,
};

export { rayChatOutputGenUI };
