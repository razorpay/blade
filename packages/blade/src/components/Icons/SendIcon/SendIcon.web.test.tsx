import SendIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<SendIcon />', () => {
  it('should render SendIcon', () => {
    const { container } = renderWithTheme(
      <SendIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
