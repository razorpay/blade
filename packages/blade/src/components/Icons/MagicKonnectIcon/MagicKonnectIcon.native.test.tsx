import renderWithTheme from '~utils/testing/renderWithTheme.native';

import MagicKonnectIcon from '.';

describe('<MagicKonnectIcon />', () => {
  it('should render MagicKonnectIcon', () => {
    const renderTree = renderWithTheme(
      <MagicKonnectIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
