import renderWithTheme from '~utils/testing/renderWithTheme.web';

import PhoneOutgoingIcon from './';

describe('<PhoneOutgoingIcon />', () => {
  it('should render PhoneOutgoingIcon', () => {
    const { container } = renderWithTheme(
      <PhoneOutgoingIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
