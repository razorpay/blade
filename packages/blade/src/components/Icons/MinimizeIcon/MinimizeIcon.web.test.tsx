import MinimizeIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<MinimizeIcon />', () => {
  it('should render MinimizeIcon', () => {
    const { container } = renderWithTheme(
      <MinimizeIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
