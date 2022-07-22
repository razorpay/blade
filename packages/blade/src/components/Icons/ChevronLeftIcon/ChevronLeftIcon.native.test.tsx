import ChevronLeftIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<ChevronLeftIcon />', () => {
  it('should render ChevronLeftIcon', () => {
    const renderTree = renderWithTheme(
      <ChevronLeftIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
