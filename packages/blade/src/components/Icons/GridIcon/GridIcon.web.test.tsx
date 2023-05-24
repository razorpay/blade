import GridIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<GridIcon />', () => {
  it('should render GridIcon', () => {
    const { container } = renderWithTheme(
      <GridIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
