import { Text } from 'react-native';
import styled from 'styled-components';
import BaseBox from '../BaseBox';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { useStyledProps, getStyledProps } from '~components/Box/styledProps';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

type MyComponentWithStyledProps = {
  test: 'working???';
} & StyledPropsBlade;

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

describe('styledProps with getStyledProps', () => {
  it('should add styledProps in styles', () => {
    const { toJSON } = renderWithTheme(
      <ComponentWithGetStyledProps margin={['spacing.0', 'spacing.10']} test="working???" />,
    );

    expect(toJSON()).toMatchInlineSnapshot(`
      <View
        style={
          Object {
            "flex": 1,
          }
        }
      >
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
      </View>
    `);
  });
});

describe('styledProps with useStyledProps', () => {
  it('should add styledProps on actual base element', () => {
    const { toJSON } = renderWithTheme(
      <ComponentWithUseStyledProps margin={['spacing.0', 'spacing.10']} test="working???" />,
    );

    expect(toJSON()).toMatchInlineSnapshot(`
      <View
        style={
          Object {
            "flex": 1,
          }
        }
      >
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
      </View>
    `);
  });
});
