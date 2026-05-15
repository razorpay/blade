import renderWithTheme from '~utils/testing/renderWithTheme.native';

import ExternalLinkIcon from '.';

describe('<ExternalLinkIcon />', () => {
  it('should render ExternalLinkIcon', () => {
    const renderTree = renderWithTheme(
      <ExternalLinkIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
