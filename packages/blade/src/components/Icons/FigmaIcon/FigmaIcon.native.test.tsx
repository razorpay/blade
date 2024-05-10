import FigmaIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<FigmaIcon />', () => {
  it('should render FigmaIcon', () => {
    const renderTree = renderWithTheme(
      <FigmaIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
