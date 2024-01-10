import ShieldIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ShieldIcon />', () => {
  it('should render ShieldIcon', () => {
    const { container } = renderWithTheme(
      <ShieldIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
