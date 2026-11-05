import WrenchIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<WrenchIcon />', () => {
  it('should render WrenchIcon', () => {
    const { container } = renderWithTheme(
      <WrenchIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
