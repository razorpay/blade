import LayoutIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<LayoutIcon />', () => {
  it('should render LayoutIcon', () => {
    const { container } = renderWithTheme(
      <LayoutIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
