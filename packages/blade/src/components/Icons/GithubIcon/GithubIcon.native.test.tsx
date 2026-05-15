import renderWithTheme from '~utils/testing/renderWithTheme.native';

import GithubIcon from '.';

describe('<GithubIcon />', () => {
  it('should render GithubIcon', () => {
    const renderTree = renderWithTheme(
      <GithubIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
