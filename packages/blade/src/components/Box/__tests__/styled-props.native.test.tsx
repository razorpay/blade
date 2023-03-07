import { Text } from 'react-native';
import styled from 'styled-components';
import BaseBox from '../BaseBox';
import type { StyledProps } from '~components/Box/styled-props';
import { useStyledProps, getStyledProps } from '~components/Box/styled-props';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

type MyComponentWithStyledProps = {
  test: 'working???';
} & StyledProps;

const ComponentWithGetStyledProps = (props: MyComponentWithStyledProps): JSX.Element => {
  return <BaseBox {...getStyledProps(props)} />;
};

const ComponentWithUseStyledProps = styled(Text)<MyComponentWithStyledProps>((props) => {
  const styledPropsCSSObject = useStyledProps(props);
  return {
    display: 'flex',
    marginLeft: '0px',
    ...styledPropsCSSObject,
  };
});

describe('styled-props with getStyledProps', () => {
  it('should add styled-props in styles', () => {
    const { toJSON } = renderWithTheme(
      <ComponentWithGetStyledProps margin={['spacing.0', 'spacing.10']} test="working???" />,
    );

    expect(toJSON()).toMatchInlineSnapshot(`
      <View
        style={
          Array [
            Object {
              "marginBottom": 0,
              "marginLeft": 48,
              "marginRight": 48,
              "marginTop": 0,
            },
          ]
        }
      />
    `);
  });
});

describe('styled-props with useStyledProps', () => {
  it('should add styled-props on actual base element', () => {
    const { toJSON } = renderWithTheme(
      <ComponentWithUseStyledProps margin={['spacing.0', 'spacing.10']} test="working???" />,
    );

    expect(toJSON()).toMatchInlineSnapshot(`
      <Text
        margin={
          Array [
            "spacing.0",
            "spacing.10",
          ]
        }
        style={
          Array [
            Object {
              "display": "flex",
              "marginBottom": 0,
              "marginLeft": 48,
              "marginRight": 48,
              "marginTop": 0,
            },
          ]
        }
        test="working???"
      />
    `);
  });
});
