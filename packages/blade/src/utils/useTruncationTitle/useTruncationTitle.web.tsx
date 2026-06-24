import React from 'react';

/**
 *  Utility function that takes checks if text is truncated and adds `htmlTitle` with full text
 *
 * ## Usage
 *
 * ```tsx
 * const { containerRef, textRef } = useTruncationTitle({ content: 'saurabhdaware99@gmail.com' });
 *
 * <Box ref={containerRef}>
 *    <BaseText ref={textRef} truncateAfterLines={1}>
 *      saurabhdaware99@gmail.com
 *    </BaseText>
 * </Box>
 * ```
 */
const useTruncationTitle = ({
  content,
}: {
  /**
   * content that you want to set as htmlTitle
   */
  content?: string;
}): {
  containerRef: React.RefObject<HTMLDivElement>;
  textRef: React.RefObject<HTMLParagraphElement>;
} => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const textRef = React.useRef<HTMLParagraphElement>(null);

  React.useEffect(() => {
    if (!textRef.current || !containerRef.current) {
      return;
    }

    const isTextTruncated =
      textRef.current.scrollHeight > containerRef.current.clientHeight ||
      textRef.current.scrollWidth > containerRef.current.clientWidth;

    if (isTextTruncated && content) {
      textRef.current.setAttribute('title', content);
    } else {
      textRef.current.removeAttribute('title');
    }
  }, [content]);

  return {
    containerRef,
    textRef,
  };
};

export { useTruncationTitle };
