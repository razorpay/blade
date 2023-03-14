import styled from 'styled-components';
import BaseBox from '../BaseBox';
import type { StyledPropsBlade } from '~components/Box/styled-props';
import { useStyledProps, getStyledProps } from '~components/Box/styled-props';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

type MyComponentWithStyledProps = {
  test: 'working???';
} & StyledPropsBlade;

const ComponentWithGetStyledProps = (props: MyComponentWithStyledProps): JSX.Element => {
  return <BaseBox {...getStyledProps(props)}>Hello!</BaseBox>;
};

const ComponentWithUseStyledProps = styled.button<MyComponentWithStyledProps>((props) => {
  const styledPropsCSSObject = useStyledProps(props);
  return {
    // should be overridden in tests
    margin: '0px',
    display: 'inline-block',
    ...styledPropsCSSObject,
  };
});

describe('styled-props with getStyledProps', () => {
  it('should add styled-props in styles', () => {
    const { container } = renderWithTheme(
      <ComponentWithGetStyledProps margin={['spacing.0', 'spacing.10']} test="working???" />,
    );

    expect(container).toMatchInlineSnapshot(`
      .c0 {
        margin: 0px 48px;
      }

      <div>
        <div
          class="c0"
        >
          Hello!
        </div>
      </div>
    `);
  });
});

describe('styled-props with useStyledProps', () => {
  it('should add styled-props on actual base element', () => {
    const { container } = renderWithTheme(
      <ComponentWithUseStyledProps margin={['spacing.0', 'spacing.10']} test="working???">
        hi
      </ComponentWithUseStyledProps>,
    );

    expect(container).toMatchInlineSnapshot(`
      .c0 {
        margin: 0px 48px;
        display: inline-block;
      }

      <div>
        <button
          class="c0"
        >
          hi
        </button>
      </div>
    `);
  });
});
