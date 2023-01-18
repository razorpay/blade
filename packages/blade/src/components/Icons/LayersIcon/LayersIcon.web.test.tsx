import LayersIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<LayersIcon />', () => {
  it('should render LayersIcon', () => {
    const { container } = renderWithTheme(
      <LayersIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
