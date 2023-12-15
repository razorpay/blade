import MapPinIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<MapPinIcon />', () => {
  it('should render MapPinIcon', () => {
    const { container } = renderWithTheme(
      <MapPinIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
