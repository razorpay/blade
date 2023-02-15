import BaseBox from '../BaseBox';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<BaseBox />', () => {
  it('should render BaseBox component with the correct styles', () => {
    const renderTree = renderWithTheme(
      <BaseBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        alignSelf="center"
        paddingTop="spacing.3"
        paddingBottom="spacing.4"
        paddingLeft="spacing.5"
        paddingRight="spacing.6"
        minHeight={48}
        maxHeight={56}
        minWidth={48}
        maxWidth={56}
        position="absolute"
        top={0}
        right={0}
        bottom={0}
        left={0}
        overflow="hidden"
        background="hotpink"
        height="auto"
        width="auto"
      />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
