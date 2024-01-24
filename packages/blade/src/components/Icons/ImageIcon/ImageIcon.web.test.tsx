import ImageIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ImageIcon />', () => {
  it('should render ImageIcon', () => {
    const { container } = renderWithTheme(
      <ImageIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
