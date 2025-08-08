import MagicKonnectFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<MagicKonnectFilledIcon />', () => {
  it('should render MagicKonnectFilledIcon', () => {
    const renderTree = renderWithTheme(
      <MagicKonnectFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
