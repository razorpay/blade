import CloudRainIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<CloudRainIcon />', () => {
  it('should render CloudRainIcon', () => {
    const { container } = renderWithTheme(
      <CloudRainIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
