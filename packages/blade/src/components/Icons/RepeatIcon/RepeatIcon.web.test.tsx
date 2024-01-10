import RepeatIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<RepeatIcon />', () => {
  it('should render RepeatIcon', () => {
    const { container } = renderWithTheme(
      <RepeatIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
