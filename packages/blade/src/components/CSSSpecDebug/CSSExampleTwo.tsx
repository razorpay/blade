import styled from 'styled-components';
import { BaseBox } from '~components/Box/BaseBox';
import { Text } from '~components/Typography';

const CSSExampleTwo = styled(BaseBox)`
  position: fixed;
`;

const CSSExampleTwoWithWrapper = (): React.ReactElement => {
  return (
    <BaseBox position="relative">
      <CSSExampleTwo
        position="absolute"
        top="spacing.0"
        left="spacing.0"
        zIndex={999}
        backgroundColor="feedback.background.negative.intense"
      >
        <Text>Hi there!!!</Text>
      </CSSExampleTwo>
    </BaseBox>
  );
};

export { CSSExampleTwo, CSSExampleTwoWithWrapper };
