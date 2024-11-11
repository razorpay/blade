import Signal0BarIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<Signal0BarIcon />', () => {
  it('should render Signal0BarIcon', () => {
    const { container } = renderWithTheme(
      <Signal0BarIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
