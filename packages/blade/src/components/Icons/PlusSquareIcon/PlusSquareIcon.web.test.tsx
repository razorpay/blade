import PlusSquareIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PlusSquareIcon />', () => {
  it('should render PlusSquareIcon', () => {
    const { container } = renderWithTheme(
      <PlusSquareIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
