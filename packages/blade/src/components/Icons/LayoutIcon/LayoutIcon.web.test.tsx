import LayoutIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<LayoutIcon />', () => {
  it('should render LayoutIcon', () => {
    const { container } = renderWithTheme(
      <LayoutIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
