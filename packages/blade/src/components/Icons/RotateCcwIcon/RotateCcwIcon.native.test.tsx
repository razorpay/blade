import RotateCcwIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<RotateCcwIcon />', () => {
  it('should render RotateCcwIcon', () => {
    const renderTree = renderWithTheme(
      <RotateCcwIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
