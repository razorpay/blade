import BaseBox from '../BaseBox';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

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
});
