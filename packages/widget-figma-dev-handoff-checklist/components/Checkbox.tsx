/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
const { AutoLayout, SVG: Svg, Text, Input, useSyncedState } = figma.widget;

interface CheckboxProps {
  id: string;
  optionText?: string;
  helpText?: string;
  isEditable?: boolean;
  isEditablePlaceholderText?: string;
  isEditableInputWithDateField?: boolean;
  onCheckboxClick: ({ isChecked, optionText }: { isChecked: boolean; optionText: string }) => void;
}

function Checkbox({
  id,
  optionText = 'An option text',
  helpText,
  isEditable = false,
  isEditablePlaceholderText = "Reviewer's Name",
  isEditableInputWithDateField = false,
  onCheckboxClick,
}: CheckboxProps) {
  const [isChecked, setChecked] = useSyncedState(`${id}_checked`, false);
  const [optionTextInput, setOptionTextInput] = useSyncedState(`${id}_optionInputText`, '');
  const [helpTextInput, setHelpTextInput] = useSyncedState(`${id}_helpInputText`, '');
  const checkIcon = `
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

  const handleOnClick = ({ optionText }: { optionText: string }) => {
    setChecked(!isChecked);
    onCheckboxClick({ isChecked: !isChecked, optionText });
  };

  return (
    <AutoLayout
      padding={{ horizontal: 4, vertical: 2 }}
      cornerRadius={4}
      direction="vertical"
      width="fill-parent"
      onClick={isEditable ? () => {} : () => handleOnClick({ optionText })}
      hoverStyle={{ fill: { r: 0, g: 0, b: 0, a: 0.04 } }}
    >
      <AutoLayout padding={{ vertical: 2 }} direction="horizontal" spacing={4} width="fill-parent">
        <AutoLayout
          width={20}
          height={20}
          verticalAlignItems="center"
          horizontalAlignItems="center"
        >
          <AutoLayout
            verticalAlignItems="center"
            horizontalAlignItems="center"
            width={16}
            height={16}
            cornerRadius={2}
            fill={isChecked ? '#305EFF' : '#FFFFFF'}
            stroke={isChecked ? '#305EFF' : '#CBD5E2'}
            strokeWidth={1.5}
            onClick={isEditable ? () => handleOnClick({ optionText }) : () => {}}
          >
            {isChecked && <Svg src={checkIcon} width={12} height={12} />}
          </AutoLayout>
        </AutoLayout>
        <AutoLayout direction="vertical" width="fill-parent">
          {isEditable ? (
            <AutoLayout direction="horizontal" spacing={4} width="fill-parent">
              <Text
                fontSize={14}
                fontWeight={400}
                lineHeight={20}
                fill={isChecked ? '#768EA7' : '#40566D'}
                onClick={isEditable ? () => handleOnClick({ optionText }) : () => {}}
              >
                {optionText}
              </Text>
              <Input
                value={optionTextInput}
                placeholder={`<${isEditablePlaceholderText}>`}
                onTextEditEnd={(e) => setOptionTextInput(e.characters)}
                fontSize={14}
                fontWeight={600}
                lineHeight={20}
                fill={isChecked ? '#768EA7' : '#40566D'}
                width="fill-parent"
                hoverStyle={{ fill: '#305EFF' }}
              />
            </AutoLayout>
          ) : (
            <Text
              fontSize={14}
              fontWeight={400}
              lineHeight={20}
              fill={isChecked ? '#768EA7' : '#40566D'}
              width="fill-parent"
              onClick={isEditable ? () => handleOnClick({ optionText }) : () => {}}
            >
              {optionText}
            </Text>
          )}
          {isEditable && isEditableInputWithDateField ? (
            <Input
              value={helpTextInput}
              placeholder="<Review date>"
              onTextEditEnd={(e) => setHelpTextInput(e.characters)}
              fontSize={11}
              fontWeight={400}
              lineHeight={16}
              fill="#768EA7"
              italic={true}
              width="fill-parent"
              hoverStyle={{ fill: '#305EFF' }}
            />
          ) : null}
          {helpText ? (
            <Text
              fontSize={11}
              fontWeight={400}
              lineHeight={16}
              fill="#768EA7"
              italic={true}
              width="fill-parent"
            >
              {helpText}
            </Text>
          ) : null}
          {/* {(helpText || isEditableInputWithDateField) &&
            (isEditable ? (
              <Input
                value={helpTextInput}
                placeholder="<Review date>"
                onTextEditEnd={(e) => setHelpTextInput(e.characters)}
                fontSize={11}
                fontWeight={400}
                lineHeight={16}
                fill="#768EA7"
                italic={true}
                width="fill-parent"
                hoverStyle={{ fill: '#305EFF' }}
              />
            ) : (
              <Text
                fontSize={11}
                fontWeight={400}
                lineHeight={16}
                fill="#768EA7"
                italic={true}
                width="fill-parent"
              >
                {helpText}
              </Text>
            ))} */}
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  );
}

export default Checkbox;
