import renderWithTheme from '~utils/testing/renderWithTheme.native';

import FreelanceIcon from '.';

describe('<FreelanceIcon />', () => {
  it('should render FreelanceIcon', () => {
    const renderTree = renderWithTheme(
      <FreelanceIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
