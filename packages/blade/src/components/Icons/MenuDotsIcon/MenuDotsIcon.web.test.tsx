import MenuDotsIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<MenuDotsIcon />', () => {
  it('should render MenuDotsIcon', () => {
    const { container } = renderWithTheme(
      <MenuDotsIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
