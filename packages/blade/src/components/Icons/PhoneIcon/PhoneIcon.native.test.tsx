import renderWithTheme from '~utils/testing/renderWithTheme.native';

import PhoneIcon from '.';

describe('<PhoneIcon />', () => {
  it('should render PhoneIcon', () => {
    const renderTree = renderWithTheme(
      <PhoneIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
