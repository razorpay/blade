import MapIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<MapIcon />', () => {
  it('should render MapIcon', () => {
    const { container } = renderWithTheme(
      <MapIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
