import SquareIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<SquareIcon />', () => {
  it('should render SquareIcon', () => {
    const { container } = renderWithTheme(
      <SquareIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
