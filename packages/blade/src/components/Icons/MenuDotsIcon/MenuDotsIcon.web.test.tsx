import MenuDotsIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<MenuDotsIcon />', () => {
  it('should render MenuDotsIcon', () => {
    const { container } = renderWithTheme(
      <MenuDotsIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
