import SlackIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<SlackIcon />', () => {
  it('should render SlackIcon', () => {
    const { container } = renderWithTheme(
      <SlackIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
