import ShuffleIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ShuffleIcon />', () => {
  it('should render ShuffleIcon', () => {
    const renderTree = renderWithTheme(
      <ShuffleIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
