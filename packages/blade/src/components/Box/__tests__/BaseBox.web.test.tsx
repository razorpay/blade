import BaseBox from '../BaseBox';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

describe('<BaseBox />', () => {
  it('should render BaseBox component with the correct styles', () => {
    const { container } = renderWithTheme(
      <BaseBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        alignSelf="center"
        paddingTop="spacing.3"
        paddingBottom="spacing.4"
        paddingLeft="spacing.5"
        paddingRight="spacing.6"
        minHeight="48px"
        maxHeight="56px"
        minWidth="48px"
        maxWidth="56px"
        position="absolute"
        top="0px"
        right="0px"
        bottom="0px"
        left="0px"
        overflow="hidden"
        height="auto"
        width="auto"
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should not contain any unnecessary html attributes', () => {
    const displayText = 'Displaying some text';
    const { getByText } = renderWithTheme(
      <BaseBox
        order="1"
        zIndex={100}
        display="flex"
        justifyContent="center"
        alignItems="center"
        alignSelf="center"
        paddingTop="spacing.3"
        paddingBottom="spacing.4"
        paddingLeft="spacing.5"
        paddingRight="spacing.6"
        minHeight="48px"
        maxHeight="56px"
        minWidth="48px"
        maxWidth="56px"
        position="absolute"
        top="0px"
        right="0px"
        bottom="0px"
        left="0px"
        overflow="hidden"
        height="auto"
        width="spacing.4"
      >
        {displayText}
      </BaseBox>,
    );
    expect(getByText(displayText)).not.toHaveAttribute('order');
    expect(getByText(displayText)).not.toHaveAttribute('margin');
    expect(getByText(displayText)).not.toHaveAttribute('padding');
    expect(getByText(displayText)).not.toHaveAttribute('width');
    expect(getByText(displayText)).not.toHaveAttribute('height');
    expect(getByText(displayText)).not.toHaveAttribute('z-index');
    expect(getByText(displayText)).not.toHaveAttribute('position');
    expect(getByText(displayText)).not.toHaveAttribute('margin-bottom');
    expect(getByText(displayText)).not.toHaveAttribute('top');
    expect(getByText(displayText)).not.toHaveAttribute('align-self');
    expect(getByText(displayText)).not.toHaveAttribute('overflow');
  });

  it('should have proper meta attributes', () => {
    const { getByText } = renderWithTheme(<BaseBox>hello</BaseBox>);
    expect(getByText('hello')).toHaveAttribute('data-blade-component', MetaConstants.BaseBox);
  });

  it('passed in metaAttribute should override default one', () => {
    const { getByText } = renderWithTheme(
      <BaseBox {...metaAttribute({ name: 'test' })}>hello</BaseBox>,
    );
    expect(getByText('hello')).toHaveAttribute('data-blade-component', 'test');
  });
  it('should support passing data-analytics  attributes', () => {
    const { container } = renderWithTheme(<BaseBox data-analytics-name="demo" />);
    expect(container).toMatchSnapshot();
  });
  it('should support passing data-analytics  attributes', () => {
    const { container } = renderWithTheme(<BaseBox data-analytics-name="section" as="section" />);
    expect(container).toMatchSnapshot();
  });
});
