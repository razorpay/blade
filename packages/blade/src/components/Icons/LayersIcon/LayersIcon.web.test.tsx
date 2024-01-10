import LayersIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<LayersIcon />', () => {
  it('should render LayersIcon', () => {
    const { container } = renderWithTheme(
      <LayersIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
