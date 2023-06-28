import SquareIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<SquareIcon />', () => {
  it('should render SquareIcon', () => {
    const { container } = renderWithTheme(
      <SquareIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
