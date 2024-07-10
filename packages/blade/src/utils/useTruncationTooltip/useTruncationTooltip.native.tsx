const useTruncationTooltip = ({ content }: { content?: string }) => {
  return {
    containerRef: { current: null },
    textRef: { current: null },
  };
};

export { useTruncationTooltip };
