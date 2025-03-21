import styled from 'styled-components';

const getBaseBoxStyles = (props: { color: string }): { color: string } => {
  return {
    color: props.color,
  };
};

const BaseBox = styled.div<{ color: string }>`
  ${(props) => {
    const styles = getBaseBoxStyles(props);
    return `
      color: ${styles.color};
    `;
  }}
`;

const CSSExampleOne = styled(BaseBox)`
  color: red;
`;

export { CSSExampleOne };
