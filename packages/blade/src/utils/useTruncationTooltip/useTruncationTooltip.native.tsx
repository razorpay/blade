const useTruncationTooltip = ({
  content: _,
}: {
  content?: string;
}): {
  containerRef: { current: null };
  textRef: { current: null };
} => {
  return {
    containerRef: { current: null },
    textRef: { current: null },
  };
};

export { useTruncationTooltip };
