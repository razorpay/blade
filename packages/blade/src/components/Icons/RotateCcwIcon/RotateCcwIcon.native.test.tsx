import RotateCcwIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<RotateCcwIcon />', () => {
  it('should render RotateCcwIcon', () => {
    const renderTree = renderWithTheme(
      <RotateCcwIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
