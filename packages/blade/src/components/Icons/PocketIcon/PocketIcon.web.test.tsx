import PocketIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PocketIcon />', () => {
  it('should render PocketIcon', () => {
    const { container } = renderWithTheme(
      <PocketIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
