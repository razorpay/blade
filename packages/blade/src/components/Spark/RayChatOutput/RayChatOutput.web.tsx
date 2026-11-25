import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components, ExtraProps, Options } from 'react-markdown';
import type { Element } from 'hast';
import styled from 'styled-components';
import { cleanRayText } from './cleanRayText';
import { remarkRayChat } from './remarkRayChat';
import type { RayChatOutputProps } from './types';
import BaseBox from '~components/Box/BaseBox';
import { MarkdownCodeBlockRenderer } from '~components/GenUI/MarkdownCodeBlock';
import { Link } from '~components/Link';
import { getStyledProps } from '~components/Box/styledProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
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
 *
 * While a reply streams, its opening paragraph shows as body text; when a title arrives after it,
 * it grows into the main title with the owner's soft ease-out (GROW). Size, line height, letter
 * spacing, colour and the height all move together; the fonts can't, so a body-text copy fades out
 * over it (data-ray-chat-was) while the text fades in. Reduced motion switches at once.
 */
/** The owner's ease for the grow ("a nice ease"): a soft ease-out. Not a Blade motion token. */
const GROW = { durationMs: 320, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' };

const StyledRayChatOutput = styled(BaseBox)<{ $isDark: boolean }>`
  ${({ theme, $isDark }) => {
    const { fonts, lineHeights, letterSpacings } = theme.typography;
    const { colors, spacing, border } = theme;
    const tint = colors.interactive.background.gray.faded;
    const grow = `${GROW.durationMs}ms ${GROW.easing}`;

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

      /* IDs and inline code: Inter on a light tint. Code blocks are GenUI's (language, copy). */
      & :not(pre) > code {
        font-family: ${fonts.family.text};
        font-size: inherit;
        background: ${tint};
        border-radius: ${makeBorderSize(border.radius.xsmall)};
        padding: 0 ${makeSpace(spacing[2])};
      }
      /* The block's own top margin would add to the gap; long lines wrap, as the chat rule says. */
      & pre { margin: 0; }
      & pre code { white-space: pre-wrap; overflow-wrap: anywhere; }

      & blockquote { margin: 0; padding: 0; }
      & blockquote > * + * { margin-top: ${makeSpace(spacing[5])}; }

      & [data-ray-chat-opening] {
        position: relative;
        transition: font-size ${grow}, line-height ${grow}, letter-spacing ${grow}, color ${grow};
      }
      & [data-ray-chat-was] {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        font-family: ${fonts.family.text};
        font-size: ${makeTypographySize(fonts.size[100])};
        font-weight: ${fonts.weight.regular};
        line-height: ${makeTypographySize(lineHeights[200])};
        letter-spacing: ${makeLetterSpacing(letterSpacings[50], fonts.size[100])};
        color: ${colors.surface.text.gray.subtle};
        text-wrap: pretty;
        pointer-events: none;
        user-select: none;
        animation: ray-chat-output-fade-out ${grow} both;
      }
      /* GenUI's word fade has played already; it shouldn't replay in the copy. */
      & [data-ray-chat-was] [data-animate-word] { animation: none; }
      & [data-ray-chat-growing] > [data-ray-chat-now] {
        animation: ray-chat-output-fade-in ${grow} both;
      }
      @keyframes ray-chat-output-fade-in { from { opacity: 0; } to { opacity: 1; } }
      @keyframes ray-chat-output-fade-out { from { opacity: 1; } to { opacity: 0; } }
      @media (prefers-reduced-motion: reduce) {
        & [data-ray-chat-opening] { transition: none; }
        & [data-ray-chat-was] { display: none; }
        & [data-ray-chat-growing] > [data-ray-chat-now] { animation: none; }
      }
    `;
  }}
`;

/** A code block's gap is set on its `code`; the block around it needs it. */
const gapOfFirstChild = (node?: Element): string | undefined => {
  const first = node?.children[0];
  return first?.type === 'element' ? (first.properties.dataRayChatGap as string) : undefined;
};

const hasDataAttribute = (props: object, name: string): boolean => {
  const value = (props as Record<string, unknown>)[name];
  return value !== undefined && value !== false;
};

/**
 * A paragraph. The opening one (data-ray-chat-opening) shows as body text and, if a title arrives
 * after it while the reply streams, grows into the main title: for GROW.durationMs its body-text
 * copy fades out over the growing text.
 */
const ChatParagraph = ({
  node: _node,
  children,
  ...props
}: React.ComponentPropsWithoutRef<'p'> & ExtraProps): React.ReactElement => {
  const isMainTitle = hasDataAttribute(props, 'data-ray-chat-lead');
  const [wasMainTitle, setWasMainTitle] = React.useState(isMainTitle);
  const [isGrowing, setIsGrowing] = React.useState(false);
  if (isMainTitle !== wasMainTitle) {
    // Adjusting state on a prop change: it grows only when it becomes the main title once drawn.
    setWasMainTitle(isMainTitle);
    setIsGrowing(isMainTitle);
  }
  React.useEffect(() => {
    if (!isGrowing) return undefined;
    const timer = setTimeout(() => setIsGrowing(false), GROW.durationMs);
    return () => clearTimeout(timer);
  }, [isGrowing]);

  if (!hasDataAttribute(props, 'data-ray-chat-opening')) return <p {...props}>{children}</p>;
  return (
    <p {...props} data-ray-chat-growing={isGrowing ? '' : undefined}>
      {isGrowing ? (
        <span aria-hidden="true" data-ray-chat-was="">
          {children}
        </span>
      ) : null}
      <span data-ray-chat-now="">{children}</span>
    </p>
  );
};

// Kept at module level so a streaming reply re-renders without remounting its elements.
const remarkPlugins = [remarkRayChat] as Options['remarkPlugins'];
const remarkPluginsWithoutMainTitle = [
  [remarkRayChat, { hasMainTitle: false }],
] as Options['remarkPlugins'];
const markdownComponents: Components = {
  p: ChatParagraph,
  // Italic is drawn as plain text.
  em: ({ children }) => <span>{children}</span>,
  // Blade's Link, as GenUI's TEXT draws links.
  a: ({ href, children }) => (
    <Link
      href={href}
      size="medium"
      variant="anchor"
      color="primary"
      target="_blank"
      rel="noopener noreferrer"
    >
      {(children as unknown) as string}
    </Link>
  ),
  // An image is drawn as its alt text.
  img: ({ alt }) => <span>{alt}</span>,
  // GenUI's code block (language and copy button), in a block that carries the chat's gap.
  pre: ({ node, children }) => (
    <div data-ray-chat-gap={gapOfFirstChild(node)}>
      <MarkdownCodeBlockRenderer>{children}</MarkdownCodeBlockRenderer>
    </div>
  ),
};

type BaseRayChatOutputProps = RayChatOutputProps & {
  /** Internal: rehype plugins run on the drawn tree, e.g. GenUI's streaming word fade. */
  rehypePlugins?: Options['rehypePlugins'];
  /** Internal: false for a later part of one reply (GenUI's second TEXT on), so it has no main title. */
  hasMainTitle?: boolean;
};

const _BaseRayChatOutput = (
  { children, testID, rehypePlugins, hasMainTitle = true, ...rest }: BaseRayChatOutputProps,
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
        remarkPlugins={hasMainTitle ? remarkPlugins : remarkPluginsWithoutMainTitle}
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
 * Draws one RAY chat message, its Markdown, the way RAY's chat looks: the opening paragraph (the
 * answer) as the main title when a title follows it, short replies as body text, then titles, body,
 * lists and code by the chat rules. While a reply streams, its opening paragraph shows as body text
 * and grows smoothly into the main title if a title arrives after it.
 *
 * @example
 * <RayChatOutput>{reply}</RayChatOutput>
 */
const RayChatOutput = assignWithoutSideEffects(
  React.forwardRef<BladeElementRef, RayChatOutputProps>((props, ref) => (
    <BaseRayChatOutput {...props} ref={ref} />
  )),
  { displayName: 'RayChatOutput', componentId: MetaConstants.RayChatOutput },
);

export { RayChatOutput, BaseRayChatOutput };
