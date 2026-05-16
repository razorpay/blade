import renderWithTheme from '~utils/testing/renderWithTheme.native';

import EyeOffIcon from '.';

describe('<EyeOffIcon />', () => {
  it('should render EyeOffIcon', () => {
    const renderTree = renderWithTheme(
      <EyeOffIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
