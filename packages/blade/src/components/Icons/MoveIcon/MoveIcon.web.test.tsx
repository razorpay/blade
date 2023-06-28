import MoveIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<MoveIcon />', () => {
  it('should render MoveIcon', () => {
    const { container } = renderWithTheme(
      <MoveIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
