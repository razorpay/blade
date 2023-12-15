import HelpCircleIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<HelpCircleIcon />', () => {
  it('should render HelpCircleIcon', () => {
    const { container } = renderWithTheme(
      <HelpCircleIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
