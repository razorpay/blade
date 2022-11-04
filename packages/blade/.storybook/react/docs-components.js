import { Text, Title } from '../../src/components';

import { BaseText } from '../../src/components/Typography/BaseText';
import styled from 'styled-components';

export const MarginBox = styled.div`
  margin: 12px 0px;
`;

export function H1({ children }) {
  return <Title size="large">{children}</Title>;
}

export function H2({ children }) {
  return (
    <>
      <div style={{ padding: '24px' }} />
      <Title size="medium">{children}</Title>
    </>
  );
}

export function H3({ children }) {
  return (
    <>
      <div style={{ padding: '12px' }} />
      <Title size="small">{children}</Title>
    </>
  );
}

export function Paragraph({ children }) {
  return (
    <MarginBox>
      <Text>{children}</Text>
    </MarginBox>
  );
}

export function List({ children }) {
  return (
    <BaseText
      as="li"
      css={{
        '&:not(:first-child)': {
          paddingTop: '1rem',
        },
        fontSize: '14px',
      }}
    >
      {children}
    </BaseText>
  );
}
