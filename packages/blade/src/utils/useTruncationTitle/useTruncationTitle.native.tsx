const useTruncationTitle = ({
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

export { useTruncationTitle };
