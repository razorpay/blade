import FileMinusIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<FileMinusIcon />', () => {
  it('should render FileMinusIcon', () => {
    const { container } = renderWithTheme(
      <FileMinusIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
