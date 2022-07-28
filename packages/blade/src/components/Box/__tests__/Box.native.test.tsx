import Box from '../Box';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<Box />', () => {
  it('should render Box component with the correct styles', () => {
    const renderTree = renderWithTheme(
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        alignSelf="center"
        paddingTop="spacing.2"
        paddingBottom="spacing.3"
        paddingLeft="spacing.4"
        paddingRight="spacing.5"
        minHeight={48}
        maxHeight={56}
        minWidth={48}
        maxWidth={56}
      />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
