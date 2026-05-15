import renderWithTheme from '~utils/testing/renderWithTheme.native';

import MailOpenIcon from '.';

describe('<MailOpenIcon />', () => {
  it('should render MailOpenIcon', () => {
    const renderTree = renderWithTheme(
      <MailOpenIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
