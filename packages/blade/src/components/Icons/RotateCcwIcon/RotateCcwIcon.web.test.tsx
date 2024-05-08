import RotateCcwIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<RotateCcwIcon />', () => {
  it('should render RotateCcwIcon', () => {
    const { container } = renderWithTheme(
      <RotateCcwIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
