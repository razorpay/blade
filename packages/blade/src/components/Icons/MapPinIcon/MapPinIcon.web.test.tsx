import MapPinIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<MapPinIcon />', () => {
  it('should render MapPinIcon', () => {
    const { container } = renderWithTheme(
      <MapPinIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
