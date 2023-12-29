import FileMinusIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<FileMinusIcon />', () => {
  it('should render FileMinusIcon', () => {
    const { container } = renderWithTheme(
      <FileMinusIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
