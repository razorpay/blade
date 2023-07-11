import ChevronUpIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ChevronUpIcon />', () => {
  it('should render ChevronUpIcon', () => {
    const renderTree = renderWithTheme(
      <ChevronUpIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
