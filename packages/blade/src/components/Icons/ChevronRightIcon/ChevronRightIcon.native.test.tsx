import ChevronRightIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ChevronRightIcon />', () => {
  it('should render ChevronRightIcon', () => {
    const renderTree = renderWithTheme(
      <ChevronRightIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
