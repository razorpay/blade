import HelpCircleIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<HelpCircleIcon />', () => {
  it('should render HelpCircleIcon', () => {
    const { container } = renderWithTheme(
      <HelpCircleIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
