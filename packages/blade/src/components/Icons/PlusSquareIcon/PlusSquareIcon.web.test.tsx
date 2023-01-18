import PlusSquareIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<PlusSquareIcon />', () => {
  it('should render PlusSquareIcon', () => {
    const { container } = renderWithTheme(
      <PlusSquareIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
