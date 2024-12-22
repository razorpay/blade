import Signal3BarIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<Signal3BarIcon />', () => {
  it('should render Signal3BarIcon', () => {
    const { container } = renderWithTheme(
      <Signal3BarIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
