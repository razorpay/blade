import MessageSquareIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<MessageSquareIcon />', () => {
  it('should render MessageSquareIcon', () => {
    const { container } = renderWithTheme(
      <MessageSquareIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
