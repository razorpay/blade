import StampIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<StampIcon />', () => {
  it('should render StampIcon', () => {
    const { container } = renderWithTheme(
      <StampIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
