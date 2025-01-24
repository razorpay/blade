import RoundedCornerIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<RoundedCornerIcon />', () => {
  it('should render RoundedCornerIcon', () => {
    const { container } = renderWithTheme(
      <RoundedCornerIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
