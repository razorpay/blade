import type { StoryFn, Meta } from '@storybook/react';
import React, { useRef, useEffect, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { Display } from './Display';
import { Heading } from './Heading';
import { Text } from './Text';
import { Code } from './Code';
import { Box } from '~components/Box';

type ComputedStyles = {
  fontSize: string;
  lineHeight: string;
  fontWeight: string;
  letterSpacing: string;
  fontFamily: string;
};

const getLetterSpacingPercent = (letterSpacing: string, fontSize: string): string => {
  const lsValue = parseFloat(letterSpacing);
  const fsValue = parseFloat(fontSize);

  if (isNaN(lsValue) || isNaN(fsValue) || fsValue === 0) {
    return '0%';
  }

  const percent = (lsValue / fsValue) * 100;
  return `${percent.toFixed(1)}%`;
};

const getLetterSpacingToken = (percent: string): string => {
  const value = parseFloat(percent);
  if (Math.abs(value - -3.3) < 0.5) return 'token: 25';
  if (Math.abs(value - -1.3) < 0.5) return 'token: 50';
  if (Math.abs(value) < 0.5) return 'token: 100';
  return '';
};

const getComputedStyles = (element: HTMLElement | null): ComputedStyles | null => {
  if (!element) return null;

  const styles = window.getComputedStyle(element);
  const fontSize = styles.fontSize;
  const letterSpacing = styles.letterSpacing;
  const letterSpacingPercent = getLetterSpacingPercent(letterSpacing, fontSize);
  const token = getLetterSpacingToken(letterSpacingPercent);

  return {
    fontSize,
    lineHeight: styles.lineHeight,
    fontWeight: styles.fontWeight,
    letterSpacing: `${letterSpacing} (${letterSpacingPercent})${token ? ` [${token}]` : ''}`,
    fontFamily: styles.fontFamily.split(',')[0].replace(/['"]/g, ''),
  };
};

// Column widths for consistent alignment
const COLUMN_WIDTHS = {
  typestyle: 500,
  font: 120,
  size: 70,
  lineHeight: 100,
  weight: 70,
  letterSpacing: 220,
};

const cellStyle = (width: number, overflow = false): React.CSSProperties => ({
  width,
  minWidth: width,
  flexShrink: 0,
  ...(overflow && { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }),
});

type StyleCellProps = {
  width: number;
  children: ReactNode;
};

const StyleCell = ({ width, children }: StyleCellProps): ReactElement => {
  return (
    <div style={cellStyle(width)}>
      <Text size="small">{children}</Text>
    </div>
  );
};

type TypographyRowProps = {
  children: ReactNode;
};

const TypographyRow = ({ children }: TypographyRowProps): ReactElement => {
  const ref = useRef<HTMLDivElement>(null);
  const [styles, setStyles] = useState<ComputedStyles | null>(null);

  useEffect(() => {
    // Get the first text element inside the wrapper
    const textElement = ref.current?.querySelector('h1, h2, h3, h4, h5, h6, p, span, code');
    if (textElement) {
      setStyles(getComputedStyles(textElement as HTMLElement));
    }
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      paddingY="spacing.4"
      borderBottomWidth="thin"
      borderBottomColor="surface.border.gray.subtle"
    >
      <div ref={ref} style={cellStyle(COLUMN_WIDTHS.typestyle)}>
        {children}
      </div>
      {styles && (
        <>
          <StyleCell width={COLUMN_WIDTHS.font}>{styles.fontFamily}</StyleCell>
          <StyleCell width={COLUMN_WIDTHS.size}>{styles.fontSize}</StyleCell>
          <StyleCell width={COLUMN_WIDTHS.lineHeight}>{styles.lineHeight}</StyleCell>
          <StyleCell width={COLUMN_WIDTHS.weight}>{styles.fontWeight}</StyleCell>
          <StyleCell width={COLUMN_WIDTHS.letterSpacing}>{styles.letterSpacing}</StyleCell>
        </>
      )}
    </Box>
  );
};

const TableHeader = (): ReactElement => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      paddingY="spacing.3"
      borderBottomWidth="thin"
      borderBottomColor="surface.border.gray.muted"
      backgroundColor="surface.background.gray.subtle"
    >
      <div style={cellStyle(COLUMN_WIDTHS.typestyle)}>
        <Text size="small" weight="semibold" color="surface.text.gray.muted">
          Typestyle
        </Text>
      </div>
      <div style={cellStyle(COLUMN_WIDTHS.font)}>
        <Text size="small" weight="semibold" color="surface.text.gray.muted">
          Font
        </Text>
      </div>
      <div style={cellStyle(COLUMN_WIDTHS.size)}>
        <Text size="small" weight="semibold" color="surface.text.gray.muted">
          Size
        </Text>
      </div>
      <div style={cellStyle(COLUMN_WIDTHS.lineHeight)}>
        <Text size="small" weight="semibold" color="surface.text.gray.muted">
          Line Height
        </Text>
      </div>
      <div style={cellStyle(COLUMN_WIDTHS.weight)}>
        <Text size="small" weight="semibold" color="surface.text.gray.muted">
          Weight
        </Text>
      </div>
      <div style={cellStyle(COLUMN_WIDTHS.letterSpacing)}>
        <Text size="small" weight="semibold" color="surface.text.gray.muted">
          Letter Spacing
        </Text>
      </div>
    </Box>
  );
};

const TypographyStoryMeta: Meta = {
  title: 'Components/Typography',
  parameters: {
    docs: {
      description: {
        component: 'An overview of all typography styles available in Blade.',
      },
    },
  },
};

const AllTypographyTemplate: StoryFn = (): ReactElement => {
  return (
    <Box display="flex" flexDirection="column">
      <TableHeader />

      {/* Display */}
      <TypographyRow>
        <Display size="xlarge">DisplayXLarge</Display>
      </TypographyRow>
      <TypographyRow>
        <Display size="large">DisplayLarge</Display>
      </TypographyRow>
      <TypographyRow>
        <Display size="medium">DisplayMedium</Display>
      </TypographyRow>
      <TypographyRow>
        <Display size="small">DisplaySmall</Display>
      </TypographyRow>

      {/* Heading */}
      <TypographyRow>
        <Heading size="2xlarge">Heading2XLarge</Heading>
      </TypographyRow>
      <TypographyRow>
        <Heading size="xlarge">HeadingXLarge</Heading>
      </TypographyRow>
      <TypographyRow>
        <Heading size="large">HeadingLarge</Heading>
      </TypographyRow>
      <TypographyRow>
        <Heading size="medium">HeadingMedium</Heading>
      </TypographyRow>
      <TypographyRow>
        <Heading size="small">HeadingSmall</Heading>
      </TypographyRow>

      {/* Body (Text) */}
      <TypographyRow>
        <Text size="large">BodyLarge</Text>
      </TypographyRow>
      <TypographyRow>
        <Text size="medium">BodyMedium</Text>
      </TypographyRow>
      <TypographyRow>
        <Text size="small">BodySmall</Text>
      </TypographyRow>
      <TypographyRow>
        <Text size="xsmall">BodyXSmall</Text>
      </TypographyRow>

      {/* Caption */}
      <TypographyRow>
        <Text variant="caption" size="medium">
          CaptionMedium
        </Text>
      </TypographyRow>

      {/* Code */}
      <TypographyRow>
        <Code size="medium">CodeMedium</Code>
      </TypographyRow>
      <TypographyRow>
        <Code size="small">CodeSmall</Code>
      </TypographyRow>
    </Box>
  );
};

export default TypographyStoryMeta;
export const AllTypography = AllTypographyTemplate.bind({});
AllTypography.storyName = 'All Typography';
