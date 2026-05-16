import renderWithTheme from '~utils/testing/renderWithTheme.native';

import TwitterIcon from '.';

describe('<TwitterIcon />', () => {
  it('should render TwitterIcon', () => {
    const renderTree = renderWithTheme(
      <TwitterIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
