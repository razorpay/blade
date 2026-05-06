import HorizontalBlocksIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<HorizontalBlocksIcon />', () => {
  it('should render HorizontalBlocksIcon', () => {
    const { container } = renderWithTheme(
      <HorizontalBlocksIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
