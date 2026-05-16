import renderWithTheme from '~utils/testing/renderWithTheme.web';

import MailIcon from './';

describe('<MailIcon />', () => {
  it('should render MailIcon', () => {
    const { container } = renderWithTheme(
      <MailIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
