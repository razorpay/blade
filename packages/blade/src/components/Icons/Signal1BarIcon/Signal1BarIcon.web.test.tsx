import Signal1BarIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<Signal1BarIcon />', () => {
  it('should render Signal1BarIcon', () => {
    const { container } = renderWithTheme(
      <Signal1BarIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
