/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import SectionHeader from './SectionHeader';
const { AutoLayout, Text } = figma.widget;

interface ProgressBarProps {
  cardWidgetWidth: number;
  numberOfCheckboxes: number;
  checkedItems: number;
}

function ProgressBar({ cardWidgetWidth, numberOfCheckboxes, checkedItems }: ProgressBarProps) {
  const isAllCheckboxesChecked = checkedItems === numberOfCheckboxes;

  return (
    <AutoLayout
      direction="horizontal"
      spacing="auto"
      cornerRadius={4}
      padding={{ horizontal: 8, vertical: 4 }}
      width="fill-parent"
      height={20}
      fill="#ECF1FF"
    >
      <AutoLayout
        positioning="absolute"
        x={0}
        y={0}
        width={checkedItems === 0 ? 1 : checkedItems * (cardWidgetWidth / numberOfCheckboxes)}
        height={20}
        fill={isAllCheckboxesChecked ? '#00A251' : '#D0DBFF'}
      />
      <Text fontSize={10} fontWeight={600} fill={isAllCheckboxesChecked ? '#ffffff' : '#768EA7'}>
        {isAllCheckboxesChecked ? '🎉  Ready for handoff!' : '😕  Not ready for handoff'}
      </Text>
      <SectionHeader
        title={`${checkedItems}/${numberOfCheckboxes}`}
        color={isAllCheckboxesChecked ? '#ffffff' : '#768EA7'}
      />
    </AutoLayout>
  );
}

export default ProgressBar;
