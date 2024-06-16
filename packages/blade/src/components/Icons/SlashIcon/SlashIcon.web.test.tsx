import SlashIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<SlashIcon />', () => {
  it('should render SlashIcon', () => {
    const { container } = renderWithTheme(
      <SlashIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
