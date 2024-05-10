import ResizerIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ResizerIcon />', () => {
  it('should render ResizerIcon', () => {
    const renderTree = renderWithTheme(
      <ResizerIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
