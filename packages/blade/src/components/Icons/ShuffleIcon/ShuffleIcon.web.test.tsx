import ShuffleIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<ShuffleIcon />', () => {
  it('should render ShuffleIcon', () => {
    const { container } = renderWithTheme(
      <ShuffleIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
