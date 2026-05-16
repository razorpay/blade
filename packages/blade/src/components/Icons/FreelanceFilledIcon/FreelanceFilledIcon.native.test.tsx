import renderWithTheme from '~utils/testing/renderWithTheme.native';

import FreelanceFilledIcon from '.';

describe('<FreelanceFilledIcon />', () => {
  it('should render FreelanceFilledIcon', () => {
    const renderTree = renderWithTheme(
      <FreelanceFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
