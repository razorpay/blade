import TokenHqFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<TokenHqFilledIcon />', () => {
  it('should render TokenHqFilledIcon', () => {
    const { container } = renderWithTheme(
      <TokenHqFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
