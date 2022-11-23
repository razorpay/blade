import SlashIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<SlashIcon />', () => {
  it('should render SlashIcon', () => {
    const { container } = renderWithTheme(
      <SlashIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
