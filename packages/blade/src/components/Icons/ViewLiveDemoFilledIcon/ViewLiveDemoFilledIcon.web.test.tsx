import ViewLiveDemoFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ViewLiveDemoFilledIcon />', () => {
  it('should render ViewLiveDemoFilledIcon', () => {
    const { container } = renderWithTheme(
      <ViewLiveDemoFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
