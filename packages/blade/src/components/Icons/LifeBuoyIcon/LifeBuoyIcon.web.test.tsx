import LifeBuoyIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<LifeBuoyIcon />', () => {
  it('should render LifeBuoyIcon', () => {
    const { container } = renderWithTheme(
      <LifeBuoyIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
