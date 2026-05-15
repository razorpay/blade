import renderWithTheme from '~utils/testing/renderWithTheme.web';

import PhoneOffIcon from './';

describe('<PhoneOffIcon />', () => {
  it('should render PhoneOffIcon', () => {
    const { container } = renderWithTheme(
      <PhoneOffIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
