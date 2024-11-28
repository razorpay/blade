import MagicKonnectIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<MagicKonnectIcon />', () => {
  it('should render MagicKonnectIcon', () => {
    const renderTree = renderWithTheme(
      <MagicKonnectIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
