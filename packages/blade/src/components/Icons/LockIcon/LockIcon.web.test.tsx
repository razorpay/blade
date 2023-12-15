import LockIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<LockIcon />', () => {
  it('should render LockIcon', () => {
    const { container } = renderWithTheme(
      <LockIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
