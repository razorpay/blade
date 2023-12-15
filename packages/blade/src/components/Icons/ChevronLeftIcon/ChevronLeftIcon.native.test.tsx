import ChevronLeftIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ChevronLeftIcon />', () => {
  it('should render ChevronLeftIcon', () => {
    const renderTree = renderWithTheme(
      <ChevronLeftIcon color="feedback.icon.gray.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
