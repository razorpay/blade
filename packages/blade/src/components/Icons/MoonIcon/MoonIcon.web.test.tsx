import MoonIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<MoonIcon />', () => {
  it('should render MoonIcon', () => {
    const { container } = renderWithTheme(
      <MoonIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
