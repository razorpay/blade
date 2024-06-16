import XSquareIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<XSquareIcon />', () => {
  it('should render XSquareIcon', () => {
    const renderTree = renderWithTheme(
      <XSquareIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
