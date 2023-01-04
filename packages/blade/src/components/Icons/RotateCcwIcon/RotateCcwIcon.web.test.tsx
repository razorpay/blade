import RotateCcwIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<RotateCcwIcon />', () => {
  it('should render RotateCcwIcon', () => {
    const { container } = renderWithTheme(
      <RotateCcwIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
