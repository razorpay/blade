import CastIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<CastIcon />', () => {
  it('should render CastIcon', () => {
    const { container } = renderWithTheme(
      <CastIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
