import MapIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<MapIcon />', () => {
  it('should render MapIcon', () => {
    const { container } = renderWithTheme(
      <MapIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
