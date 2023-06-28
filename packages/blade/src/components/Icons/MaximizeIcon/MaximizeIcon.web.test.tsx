import MaximizeIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<MaximizeIcon />', () => {
  it('should render MaximizeIcon', () => {
    const { container } = renderWithTheme(
      <MaximizeIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
