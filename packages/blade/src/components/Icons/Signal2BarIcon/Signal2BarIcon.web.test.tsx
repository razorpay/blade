import Signal2BarIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<Signal2BarIcon />', () => {
  it('should render Signal2BarIcon', () => {
    const { container } = renderWithTheme(
      <Signal2BarIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
