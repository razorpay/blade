import renderWithTheme from '~utils/testing/renderWithTheme.web';

import PhoneIncomingIcon from './';

describe('<PhoneIncomingIcon />', () => {
  it('should render PhoneIncomingIcon', () => {
    const { container } = renderWithTheme(
      <PhoneIncomingIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
