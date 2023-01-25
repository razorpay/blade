import MoveIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<MoveIcon />', () => {
  it('should render MoveIcon', () => {
    const { container } = renderWithTheme(
      <MoveIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
