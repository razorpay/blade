import renderWithTheme from '~utils/testing/renderWithTheme.native';

import PhoneMissedIcon from '.';

describe('<PhoneMissedIcon />', () => {
  it('should render PhoneMissedIcon', () => {
    const renderTree = renderWithTheme(
      <PhoneMissedIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
