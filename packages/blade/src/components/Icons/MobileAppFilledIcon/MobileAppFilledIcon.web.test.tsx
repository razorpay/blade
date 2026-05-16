import renderWithTheme from '~utils/testing/renderWithTheme.web';

import MobileAppFilledIcon from './';

describe('<MobileAppFilledIcon />', () => {
  it('should render MobileAppFilledIcon', () => {
    const { container } = renderWithTheme(
      <MobileAppFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
