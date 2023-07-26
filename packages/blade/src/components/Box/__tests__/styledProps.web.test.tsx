import styled from 'styled-components';
import BaseBox from '../BaseBox';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { useStyledProps, getStyledProps } from '~components/Box/styledProps';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

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

describe('styledProps with getStyledProps', () => {
  it('should add styledProps in styles', () => {
    const { container } = renderWithTheme(
      <ComponentWithGetStyledProps margin={['spacing.0', 'spacing.10']} test="working???" />,
    );

    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="BaseBox-bmPWx bDVTMW"
          data-blade-component="base-box"
        >
          Hello!
        </div>
      </div>
    `);
  });
});

describe('styledProps with useStyledProps', () => {
  it('should add styledProps on actual base element', () => {
    const { container } = renderWithTheme(
      <ComponentWithUseStyledProps margin={['spacing.0', 'spacing.10']} test="working???">
        hi
      </ComponentWithUseStyledProps>,
    );

    expect(container).toMatchInlineSnapshot(`
      <div>
        <button
          class="styledPropswebtest__ComponentWithUseStyledProps-sc-1cp73qj-0 cGFUkd"
        >
          hi
        </button>
      </div>
    `);
  });
});
