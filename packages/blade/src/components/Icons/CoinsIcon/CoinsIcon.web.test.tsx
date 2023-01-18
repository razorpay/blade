import CoinsIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<CoinsIcon />', () => {
  it('should render CoinsIcon', () => {
    const { container } = renderWithTheme(
      <CoinsIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
