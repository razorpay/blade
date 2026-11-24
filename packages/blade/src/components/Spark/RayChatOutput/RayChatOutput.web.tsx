import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components, Options } from 'react-markdown';
import type { Element } from 'hast';
import styled from 'styled-components';
import { cleanRayText } from './cleanRayText';
import { remarkRayChat } from './remarkRayChat';
import type { RayChatOutputProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import { useTheme } from '~components/BladeProvider';
import { makeBorderSize, makeSpace, makeTypographySize } from '~utils';
import { makeLetterSpacing } from '~utils/makeLetterSpacing';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import type { BladeElementRef } from '~utils/types';

/**
 * RAY's chat text, drawn by the owner's chat rules (Figma: Agentic Dashboard 2947:31563,
 * values picked on 24 Nov 2026). Three text styles, all Blade tokens:
 *
 *   main title, titles   TASA Orbiter 500, 20/26, gray.normal
 *   body                 Inter 400, 14/24, -1.3%, gray.subtle   (lists 14/26)
 *   bold                 gray.normal, 600 in light, 700 in dark
 *
 * Gaps come from remarkRayChat as data-ray-chat-gap: 12 under a title and between a paragraph's
 * lines, 16 between blocks, 24 before a section.
 */
const StyledRayChatOutput = styled(BaseBox)<{ $isDark: boolean }>`
  ${({ theme, $isDark }) => {
    const { fonts, lineHeights, letterSpacings } = theme.typography;
    const { colors, spacing, border } = theme;
    const tint = colors.interactive.background.gray.faded;

    return `
      font-family: ${fonts.family.text};
      font-size: ${makeTypographySize(fonts.size[100])};
      font-weight: ${fonts.weight.regular};
      line-height: ${makeTypographySize(lineHeights[200])};
      letter-spacing: ${makeLetterSpacing(letterSpacings[50], fonts.size[100])};
      color: ${colors.surface.text.gray.subtle};
      overflow-wrap: break-word;

      & > * { margin: 0; }
      & > [data-ray-chat-gap='12'] { margin-top: ${makeSpace(spacing[4])}; }
      & > [data-ray-chat-gap='16'] { margin-top: ${makeSpace(spacing[5])}; }
      & > [data-ray-chat-gap='24'] { margin-top: ${makeSpace(spacing[7])}; }

      & p { margin: 0; text-wrap: pretty; }

      & h1, & h2, & h3, & h4, & h5, & h6, & [data-ray-chat-lead] {
        margin: 0;
        font-family: ${fonts.family.heading};
        font-size: ${makeTypographySize(fonts.size[400])};
        font-weight: ${fonts.weight.medium};
        line-height: ${makeTypographySize(lineHeights[400])};
        letter-spacing: ${makeLetterSpacing(letterSpacings[100], fonts.size[400])};
        color: ${colors.surface.text.gray.normal};
        text-wrap: balance;
      }

      & strong {
        font-weight: ${$isDark ? fonts.weight.bold : fonts.weight.semibold};
        color: ${colors.surface.text.gray.normal};
      }

      & ul, & ol {
        margin: 0;
        padding-left: ${makeSpace(spacing[6])};
        line-height: ${makeTypographySize(lineHeights[400])};
      }

      & a { color: ${colors.interactive.text.primary.normal}; text-decoration: underline; }
      & a:hover { color: ${colors.interactive.text.primary.subtle}; }

      & code {
        font-family: ${fonts.family.text};
        font-size: inherit;
        background: ${tint};
        border-radius: ${makeBorderSize(border.radius.xsmall)};
        padding: 0 ${makeSpace(spacing[2])};
      }
      & pre {
        margin: 0;
        padding: ${makeSpace(spacing[4])};
        background: ${tint};
        border-radius: ${makeBorderSize(border.radius.medium)};
        white-space: pre-wrap;
        overflow-wrap: anywhere;
      }
      & pre code {
        padding: 0;
        background: none;
        font-family: ${fonts.family.code};
      }

      & blockquote { margin: 0; padding: 0; }
      & blockquote > * + * { margin-top: ${makeSpace(spacing[5])}; }
    `;
  }}
`;

/** A code block's gap is set on its `code`; the block needs it. */
const gapOfFirstChild = (node?: Element): string | undefined => {
  const first = node?.children[0];
  return first?.type === 'element' ? (first.properties.dataRayChatGap as string) : undefined;
};

// Kept at module level so a streaming reply re-renders without remounting its elements.
const remarkPlugins = [remarkRayChat] as Options['remarkPlugins'];
const markdownComponents: Components = {
  // Italic is drawn as plain text.
  em: ({ children }) => <span>{children}</span>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  // An image is drawn as its alt text.
  img: ({ alt }) => <span>{alt}</span>,
  pre: ({ node, children }) => <pre data-ray-chat-gap={gapOfFirstChild(node)}>{children}</pre>,
};

type BaseRayChatOutputProps = RayChatOutputProps & {
  /** Internal: rehype plugins run on the drawn tree, e.g. GenUI's streaming word fade. */
  rehypePlugins?: Options['rehypePlugins'];
};

const _BaseRayChatOutput = (
  { children, testID, rehypePlugins, ...rest }: BaseRayChatOutputProps,
  ref: React.Ref<BladeElementRef>,
): React.ReactElement => {
  const { colorScheme } = useTheme();
  const markdown = React.useMemo(() => cleanRayText(typeof children === 'string' ? children : ''), [
    children,
  ]);

  return (
    <StyledRayChatOutput
      ref={ref as never}
      $isDark={colorScheme === 'dark'}
      {...metaAttribute({ name: MetaConstants.RayChatOutput, testID })}
      {...getStyledProps(rest)}
      {...makeAnalyticsAttribute(rest)}
    >
      <ReactMarkdown
        skipHtml
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={markdownComponents}
      >
        {markdown}
      </ReactMarkdown>
    </StyledRayChatOutput>
  );
};

const BaseRayChatOutput = React.forwardRef(_BaseRayChatOutput);

/**
 * Draws one RAY chat message, its Markdown, the way RAY's chat looks: the answer first as the
 * main title when the reply has sections, then titles, body, lists and code by the chat rules.
 *
 * @example
 * <RayChatOutput>{reply}</RayChatOutput>
 */
const RayChatOutput = React.forwardRef<BladeElementRef, RayChatOutputProps>((props, ref) => (
  <BaseRayChatOutput {...props} ref={ref} />
));

export { RayChatOutput, BaseRayChatOutput };
