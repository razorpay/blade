import renderWithTheme from '~utils/testing/renderWithTheme.web';

import PhoneMissedIcon from './';

describe('<PhoneMissedIcon />', () => {
  it('should render PhoneMissedIcon', () => {
    const { container } = renderWithTheme(
      <PhoneMissedIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
