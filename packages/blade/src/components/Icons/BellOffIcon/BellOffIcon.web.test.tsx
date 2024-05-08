import BellOffIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<BellOffIcon />', () => {
  it('should render BellOffIcon', () => {
    const { container } = renderWithTheme(
      <BellOffIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
