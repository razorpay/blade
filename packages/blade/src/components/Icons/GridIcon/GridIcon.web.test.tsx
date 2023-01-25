import GridIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<GridIcon />', () => {
  it('should render GridIcon', () => {
    const { container } = renderWithTheme(
      <GridIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
