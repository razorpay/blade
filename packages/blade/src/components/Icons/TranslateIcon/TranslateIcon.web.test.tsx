import TranslateIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<TranslateIcon />', () => {
  it('should render TranslateIcon', () => {
    const { container } = renderWithTheme(
      <TranslateIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
