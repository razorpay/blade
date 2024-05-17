import PosIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PosIcon />', () => {
  it('should render PosIcon', () => {
    const renderTree = renderWithTheme(
      <PosIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
