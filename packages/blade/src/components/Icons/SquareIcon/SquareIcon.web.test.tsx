import SquareIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<SquareIcon />', () => {
  it('should render SquareIcon', () => {
    const { container } = renderWithTheme(
      <SquareIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
