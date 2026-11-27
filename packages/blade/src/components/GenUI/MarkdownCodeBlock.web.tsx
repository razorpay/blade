/**
 * GenUI's Markdown code block: the code on a tint, its language and a copy button. Shared by
 * GenUI's TEXT and RayChatOutput, so both draw code blocks the same way.
 */
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { IconButton } from '~components/Button/IconButton';
import { CheckIcon, CopyIcon } from '~components/Icons';
import { Tooltip, TooltipInteractiveWrapper } from '~components/Tooltip';

const MarkdownCodeBlock = styled.pre`
  display: inline-block;
  max-width: 660px;
  width: fit-content;
  margin: ${({ theme }) => theme.spacing[1]}px 0 ${({ theme }) => theme.spacing[0]}px;
  overflow: hidden;
  padding: 0;
  background: ${({ theme }) => theme.colors.interactive.background.gray.faded};
  border: ${({ theme }) => theme.border.width.thin}px solid
    ${({ theme }) => theme.colors.feedback.border.neutral.subtle};
  border-radius: ${({ theme }) => theme.border.radius.medium}px;
`;

const MarkdownCodeBlockHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]}px;
  padding: ${({ theme }) => theme.spacing[3]}px ${({ theme }) => theme.spacing[4]}px;
  border-bottom: ${({ theme }) => theme.border.width.thin}px solid
    ${({ theme }) => theme.colors.surface.border.gray.muted};
`;

const MarkdownCodeBlockActions = styled.span`
  display: inline-flex;
  align-items: center;
  margin-left: auto;
`;

const MarkdownCodeBlockCopyAnimation = styled.span<{ $copied: boolean }>`
  display: inline-flex;
  align-items: center;
  animation: ${({ $copied }) =>
      $copied ? 'markdown-code-copy-success' : 'markdown-code-copy-reset'}
    180ms cubic-bezier(0.2, 0.8, 0.2, 1);

  @keyframes markdown-code-copy-success {
    0% {
      opacity: 0;
      transform: scale(0.72) rotate(-12deg);
    }
    100% {
      opacity: 1;
      transform: scale(1) rotate(0deg);
    }
  }

  @keyframes markdown-code-copy-reset {
    0% {
      opacity: 0;
      transform: scale(0.88);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const MarkdownCodeBlockLanguage = styled.span`
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.surface.text.gray.muted};
  font-family: ${({ theme }) => theme.typography.fonts.family.code};
  font-size: ${({ theme }) => theme.typography.fonts.size[50]}px;
  font-weight: ${({ theme }) => theme.typography.fonts.weight.regular};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacings[100]}px;
  line-height: ${({ theme }) => theme.typography.lineHeights[50]}px;
`;

const MarkdownCodeBlockCode = styled.code`
  display: block;
  overflow-x: auto;
  padding: ${({ theme }) => theme.spacing[4]}px;
  color: ${({ theme }) => theme.colors.surface.text.gray.normal};
  font-family: ${({ theme }) => theme.typography.fonts.family.code};
  font-size: ${({ theme }) => theme.typography.fonts.size[75]}px;
  font-weight: ${({ theme }) => theme.typography.fonts.weight.regular};
  line-height: ${({ theme }) => theme.typography.lineHeights[100]}px;
  white-space: pre;
  background: none;
  border: none;
`;

const MarkdownCodeBlockCopyButton = ({ code }: { code: React.ReactNode }): JSX.Element => {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const handleCopy = (): void => {
    void navigator.clipboard.writeText(String(code ?? ''));
    setCopied(true);
    resetTimer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <MarkdownCodeBlockActions>
      <Tooltip content={copied ? 'Copied!' : 'Copy'} placement="top">
        <TooltipInteractiveWrapper>
          <MarkdownCodeBlockCopyAnimation key={copied ? 'copied' : 'copy'} $copied={copied}>
            <IconButton
              icon={copied ? CheckIcon : CopyIcon}
              size="small"
              emphasis="intense"
              accessibilityLabel="Copy code block"
              onClick={handleCopy}
            />
          </MarkdownCodeBlockCopyAnimation>
        </TooltipInteractiveWrapper>
      </Tooltip>
    </MarkdownCodeBlockActions>
  );
};

const getMarkdownCodeBlockDetails = (
  children?: React.ReactNode,
): { code: React.ReactNode; language?: string } => {
  const child = React.Children.toArray(children)[0];

  if (React.isValidElement<{ className?: string; children?: React.ReactNode }>(child)) {
    const language = child.props.className?.replace(/^language-/, '');
    return { code: child.props.children, language };
  }

  return { code: children };
};

/** The `pre` renderer for react-markdown. */
const MarkdownCodeBlockRenderer = ({ children }: { children?: React.ReactNode }): JSX.Element => {
  const { code, language } = getMarkdownCodeBlockDetails(children);

  return (
    <MarkdownCodeBlock>
      <MarkdownCodeBlockHeader>
        {language ? <MarkdownCodeBlockLanguage>{language}</MarkdownCodeBlockLanguage> : null}
        <MarkdownCodeBlockCopyButton code={code} />
      </MarkdownCodeBlockHeader>
      <MarkdownCodeBlockCode>{code}</MarkdownCodeBlockCode>
    </MarkdownCodeBlock>
  );
};

export { MarkdownCodeBlockRenderer };
