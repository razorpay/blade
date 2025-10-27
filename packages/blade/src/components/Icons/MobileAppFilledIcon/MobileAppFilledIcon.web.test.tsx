import MobileAppFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<MobileAppFilledIcon />', () => {
  it('should render MobileAppFilledIcon', () => {
    const { container } = renderWithTheme(
      <MobileAppFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
