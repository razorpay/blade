import React, { ReactElement } from 'react';
import { Heading, Text, Title } from '../Typography';
import { BaseTextProps } from '../Typography/BaseText/types';

type BaseAmountText = {
  /**
   * Sets the variant of the amount.
   *
   * @default 'heading'
   */
  variant?: `heading` | `title` | `body`;
  /**
   * Sets the size of the amount.
   *
   * @default 'low'
   */
  size?: `large` | `medium` | `small`;
  /**
   * Sets the weight of the label.
   *
   * @default 'regular'
   */
  weight?: 'regular' | 'bold';
  /**
   * color of the text.
   *
   * @default 'regular'
   */
  color?: BaseTextProps['color'];
};

const BaseAmountText = ({
  variant = 'heading',
  weight = 'regular',
  size = 'medium',
  color,
  children,
}: BaseAmountText): ReactElement => {
  if (variant === 'body')
    return (
      <Text weight={weight} size={size} color={color}>
        {children}
      </Text>
    );
  if (variant === 'title')
    return (
      <Title size={size} color={color}>
        {children}
      </Title>
    );
  return (
    <Heading weight={weight} size={size} color={color}>
      {children}
    </Heading>
  );
};

export default BaseAmountText;
