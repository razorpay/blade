import SaveIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<SaveIcon />', () => {
  it('should render SaveIcon', () => {
    const { container } = renderWithTheme(
      <SaveIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
