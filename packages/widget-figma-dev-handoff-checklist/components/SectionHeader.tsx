/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
const { AutoLayout, Text } = figma.widget;

interface SectionHeaderProps {
  title: string;
  color?: string;
}

function SectionHeader({ title, color = '#768EA7' }: SectionHeaderProps) {
  return (
    <AutoLayout>
      <Text fontSize={10} fontWeight={600} fill={color} textCase={'upper'}>
        {title}
      </Text>
    </AutoLayout>
  );
}

export default SectionHeader;
