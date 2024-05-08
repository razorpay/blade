import ViewLiveDemoIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ViewLiveDemoIcon />', () => {
  it('should render ViewLiveDemoIcon', () => {
    const { container } = renderWithTheme(
      <ViewLiveDemoIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
