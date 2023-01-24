import PocketIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<PocketIcon />', () => {
  it('should render PocketIcon', () => {
    const { container } = renderWithTheme(
      <PocketIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
