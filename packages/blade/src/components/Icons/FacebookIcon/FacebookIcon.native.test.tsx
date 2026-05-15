import renderWithTheme from '~utils/testing/renderWithTheme.native';

import FacebookIcon from '.';

describe('<FacebookIcon />', () => {
  it('should render FacebookIcon', () => {
    const renderTree = renderWithTheme(
      <FacebookIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
