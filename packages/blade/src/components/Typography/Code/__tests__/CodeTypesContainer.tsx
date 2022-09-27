import React from 'react';
import { Code } from '../Code';
import type { CodeProps } from '../Code';

/**
 * Using this file for testing and storybook utilities
 */

export const textTypes: CodeProps['type'][] = [
  'subtle',
  'muted',
  'normal',
  'placeholder',
  'subdued',
];
export const CodeTypesContainer = ({ size }: { size: CodeProps['size'] }): JSX.Element => (
  <>
    {textTypes.map((textType) => (
      <Code key={textType} type={textType} size={size}>
        TEST
      </Code>
    ))}
  </>
);
