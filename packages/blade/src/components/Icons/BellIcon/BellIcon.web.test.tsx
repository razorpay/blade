import BellIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<BellIcon />', () => {
  it('should render BellIcon', () => {
    const { container } = renderWithTheme(
      <BellIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
