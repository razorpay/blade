import Box from '../Box';
import renderWithSSR from '~src/_helpers/testing/renderWithSSR.web';

describe('<Box />', () => {
  it('should render Box component with the correct styles', () => {
    const { container } = renderWithSSR(
      <Box
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
    );
    expect(container).toMatchSnapshot();
  });
});
