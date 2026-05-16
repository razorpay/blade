import renderWithTheme from '~utils/testing/renderWithTheme.native';

import MailIcon from '.';

describe('<MailIcon />', () => {
  it('should render MailIcon', () => {
    const renderTree = renderWithTheme(
      <MailIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
