import React from 'react';

const useTruncationTooltip = ({
  content,
}: {
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

    if (textRef.current.scrollHeight > containerRef.current.clientHeight && content) {
      textRef.current.setAttribute('title', content);
    }
  }, [content]);

  return {
    containerRef,
    textRef,
  };
};

export { useTruncationTooltip };
