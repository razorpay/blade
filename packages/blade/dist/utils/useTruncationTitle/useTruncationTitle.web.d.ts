import { default as React } from 'react';
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
declare const useTruncationTitle: ({ content, }: {
    /**
     * content that you want to set as htmlTitle
     */
    content?: string | undefined;
}) => {
    containerRef: React.RefObject<HTMLDivElement>;
    textRef: React.RefObject<HTMLParagraphElement>;
};
export { useTruncationTitle };
