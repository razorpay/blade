import LayersIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<LayersIcon />', () => {
  it('should render LayersIcon', () => {
    const { container } = renderWithTheme(
      <LayersIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
