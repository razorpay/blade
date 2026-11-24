/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Long values (ids, emails, VPAs, URLs) on one line, cut in the middle when they do not fit:
 * `pay_Rk3v…Zp2Lw`. Used only with `cardLayout: 'compact'`, in INFO_GROUP values, TABLE text
 * cells and CARD titles and descriptions.
 *
 * - A click copies the whole value. A small copy icon follows the text.
 * - The tooltip shows the whole value on hover and on keyboard focus.
 * - The text takes its font and colour from its parent, so it matches the Blade text around it.
 *
 * Width: the value takes the width its parent gives it, and is cut only when it does not fit.
 * A hidden copy of the value sets the preferred width. It can break anywhere, so the box can
 * still shrink. The visible line never widens the box: it measures the width it got and cuts
 * the value to fit.
 *
 * Internal to GenUI. A public `truncate="middle"` on `Text` is a separate proposal.
 */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  getFontOf,
  getLetterSpacingOf,
  getLongValueKind,
  measureTextWidth,
  middleTruncate,
} from './longValueText.web';
import type { LongValueKind } from './longValueText.web';
import { useTheme } from '~components/BladeProvider';
import { Text } from '~components/Typography';
import { CheckIcon, CopyIcon } from '~components/Icons';
import { Tooltip, TooltipInteractiveWrapper } from '~components/Tooltip';

/** The copy icon is Blade's small icon, 12px. */
const ICON_PX = 12;
/** spacing.2 (4px) between the text and the icon. */
const ICON_GAP_STEP = 2;
/** Room for canvas and layout rounding, so a value that fits is never cut. */
const SLACK_PX = 2;
const COPIED_MS = 2000;
/** The widest a long value gets in a TABLE cell. Past it, the value is cut. */
const TABLE_LONG_VALUE_MAX_WIDTH_PX = 240;

const Root = styled.span<{ $maxWidth?: number }>`
  display: block;
  min-width: 0;
  max-width: ${({ $maxWidth }) => ($maxWidth ? `${$maxWidth}px` : '100%')};
`;

/** The measured box. Size containment: what it shows never widens the box. */
const Fit = styled.span`
  display: block;
  contain: inline-size;
  overflow: hidden;
  white-space: nowrap;
  overflow-wrap: normal;
`;

/** As wide as its text and icon, so the icon sits right after the text. */
const CopyButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[ICON_GAP_STEP]}px;
  max-width: 100%;
  vertical-align: top;
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  color: inherit;
  letter-spacing: inherit;
  text-align: start;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.border.radius.xsmall}px;

  &:focus-visible {
    outline: ${({ theme }) => theme.border.width.thick}px solid
      ${({ theme }) => theme.colors.surface.border.primary.muted};
  }
`;

const Line = styled.span`
  display: block;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
`;

const IconBox = styled.span`
  display: inline-flex;
  flex: none;
`;

/** The hidden copy that sets the preferred width: the value, and the gap and icon with copy. */
const Sizer = styled.span<{ $isCopyable: boolean }>`
  display: block;
  height: 0;
  overflow: hidden;
  visibility: hidden;
  white-space: normal;
  word-break: break-all;
  padding-inline-end: ${({ theme, $isCopyable }) =>
    ($isCopyable ? ICON_PX + theme.spacing[ICON_GAP_STEP] : 0) + SLACK_PX}px;
`;

type MiddleTruncateProps = {
  value: string;
  kind: LongValueKind;
  /** False: no copy, for a value that shows with copy elsewhere in the same card. */
  isCopyable?: boolean;
  /** The widest the value gets, in px. Default: the parent's width. */
  maxWidth?: number;
};

const MiddleTruncate = ({
  value,
  kind,
  isCopyable = true,
  maxWidth,
}: MiddleTruncateProps): React.ReactElement => {
  const { theme } = useTheme();
  const iconRoom = isCopyable ? ICON_PX + theme.spacing[ICON_GAP_STEP] : 0;
  const fitRef = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(value);
  const [isCopied, setIsCopied] = useState(false);

  useLayoutEffect(() => {
    const fitBox = fitRef.current;
    if (!fitBox) return undefined;
    let isMounted = true;
    const fit = (width: number): void => {
      if (!isMounted) return;
      const font = getFontOf(fitBox);
      // A canvas does not apply CSS letter-spacing. Blade's text sets it, so add it per character.
      const spacing = getLetterSpacingOf(fitBox);
      const measure = (part: string): number =>
        measureTextWidth(part, font) + spacing * Array.from(part).length;
      setText(middleTruncate(value, width - iconRoom - 1, measure, kind));
    };
    fit(fitBox.getBoundingClientRect().width);
    // A web font can load after the first measure.
    void document.fonts?.ready.then(() => fit(fitBox.getBoundingClientRect().width));
    const observer =
      typeof ResizeObserver === 'undefined'
        ? undefined
        : new ResizeObserver(([entry]) => {
            if (entry) fit(entry.contentRect.width);
          });
    observer?.observe(fitBox);
    return () => {
      isMounted = false;
      observer?.disconnect();
    };
  }, [value, kind, iconRoom]);

  useEffect(() => {
    if (!isCopied) return undefined;
    const timer = setTimeout(() => setIsCopied(false), COPIED_MS);
    return () => clearTimeout(timer);
  }, [isCopied]);

  const handleCopy = (): void => {
    void navigator.clipboard
      ?.writeText(value)
      .then(() => setIsCopied(true))
      .catch(() => undefined);
  };

  const isCut = text !== value;
  let tooltip = 'Copy';
  if (isCopied) tooltip = 'Copied';
  else if (isCut) tooltip = value;

  let content: React.ReactNode = <Line>{text}</Line>;
  if (isCopyable) {
    content = (
      <Tooltip content={tooltip} placement="top">
        <CopyButton type="button" aria-label={`Copy ${value}`} onClick={handleCopy}>
          <Line>{text}</Line>
          <IconBox aria-hidden>
            {isCopied ? (
              <CheckIcon size="small" color="surface.icon.gray.muted" />
            ) : (
              <CopyIcon size="small" color="surface.icon.gray.muted" />
            )}
          </IconBox>
        </CopyButton>
      </Tooltip>
    );
  } else if (isCut) {
    content = (
      <Tooltip content={value} placement="top">
        <TooltipInteractiveWrapper>
          <Line>{text}</Line>
        </TooltipInteractiveWrapper>
      </Tooltip>
    );
  }

  return (
    <Root data-genui-long-value={kind} $maxWidth={maxWidth}>
      <Fit ref={fitRef}>{content}</Fit>
      <Sizer aria-hidden $isCopyable={isCopyable}>
        {value}
      </Sizer>
    </Root>
  );
};

/**
 * At the row's right edge, as InfoGroup puts a value with `valueAlign="right"`. The value's box
 * keeps 2px of slack for rounding, so the text and icon move to its end.
 */
const EndAligned = styled.div`
  text-align: end;
`;

/** A whole long value as an INFO_GROUP value, in InfoItemValue's text style at size small. */
const InfoGroupLongValue = ({ value, kind }: { value: string; kind: LongValueKind }) => (
  <EndAligned>
    <Text as="div" size="small" weight="medium" color="surface.text.gray.subtle">
      <MiddleTruncate value={value} kind={kind} />
    </Text>
  </EndAligned>
);

/** A TABLE text cell's long value. It copies, so the cell needs no copy button of its own. */
const TableCellLongValue = ({ value, kind }: { value: string; kind: LongValueKind }) => (
  <Text size="medium">
    <MiddleTruncate value={value} kind={kind} maxWidth={TABLE_LONG_VALUE_MAX_WIDTH_PX} />
  </Text>
);

/** A short label before a long value in a title: "Payment pay_Rk3v…Zp2Lw". */
const MAX_LEAD_LENGTH = 24;

const LeadAndValue = styled.span`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing[2]}px;
  min-width: 0;
`;

const Lead = styled.span`
  flex: none;
  white-space: nowrap;
`;

/**
 * A CARD title or description: as it is, or with its long value cut in the middle. A value in
 * `valuesWithCopy` shows with copy elsewhere in the card, so it gets no copy here.
 */
const getLongValueTitle = (
  text: string | undefined,
  valuesWithCopy: ReadonlySet<string>,
): React.ReactNode => {
  if (!text) return text;
  const wholeKind = getLongValueKind(text);
  if (wholeKind) {
    return <MiddleTruncate value={text} kind={wholeKind} isCopyable={!valuesWithCopy.has(text)} />;
  }
  const split = text.lastIndexOf(' ');
  const lead = text.slice(0, split);
  const value = text.slice(split + 1);
  const kind = split > 0 && lead.length <= MAX_LEAD_LENGTH ? getLongValueKind(value) : null;
  if (!kind) return text;
  return (
    <LeadAndValue>
      <Lead>{lead}</Lead>
      <MiddleTruncate value={value} kind={kind} isCopyable={!valuesWithCopy.has(value)} />
    </LeadAndValue>
  );
};

/** A TEXT node whose whole content is one long value, as `pay_X` or `` `pay_X` ``. */
const getTextNodeValue = (node: unknown): string | null => {
  const { component, content } = (node ?? {}) as { component?: string; content?: unknown };
  if (component !== 'TEXT' || typeof content !== 'string') return null;
  return content.trim().replace(/^`([^`]+)`$/, '$1');
};

type SchemaNode = {
  component?: string;
  children?: unknown;
  items?: unknown;
  rows?: unknown;
  value?: unknown;
};

/**
 * The long values that show with copy inside a card's children: INFO_GROUP values and TABLE
 * text cells, at any depth.
 */
const getValuesWithCopy = (children: unknown): Set<string> => {
  const values = new Set<string>();
  const add = (text: unknown): void => {
    if (typeof text === 'string' && getLongValueKind(text)) values.add(text);
  };
  const walk = (nodes: unknown): void => {
    if (!Array.isArray(nodes)) return;
    nodes.forEach((node: SchemaNode | undefined) => {
      if (!node || typeof node !== 'object') return;
      if (node.component === 'INFO_GROUP' && Array.isArray(node.items)) {
        node.items.forEach((item: { value?: { children?: unknown } } | undefined) => {
          const content = item?.value?.children;
          add(typeof content === 'string' ? content : getTextNodeValue(content));
        });
      }
      if (node.component === 'TABLE' && Array.isArray(node.rows)) {
        node.rows.forEach((row: unknown) => {
          if (!Array.isArray(row)) return;
          row.forEach((cell: SchemaNode | undefined) => {
            if (cell?.component === 'TEXT') add(cell.value);
          });
        });
      }
      walk(node.children);
    });
  };
  walk(children);
  return values;
};

export {
  InfoGroupLongValue,
  TableCellLongValue,
  getLongValueTitle,
  getTextNodeValue,
  getValuesWithCopy,
};
