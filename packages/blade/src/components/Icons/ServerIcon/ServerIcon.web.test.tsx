import ServerIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ServerIcon />', () => {
  it('should render ServerIcon', () => {
    const { container } = renderWithTheme(
      <ServerIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
