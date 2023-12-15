import LogOutIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<LogOutIcon />', () => {
  it('should render LogOutIcon', () => {
    const { container } = renderWithTheme(
      <LogOutIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
