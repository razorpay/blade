import ShuffleIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ShuffleIcon />', () => {
  it('should render ShuffleIcon', () => {
    const { container } = renderWithTheme(
      <ShuffleIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
