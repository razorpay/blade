import StarFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<StarFilledIcon />', () => {
  it('should render StarFilledIcon', () => {
    const renderTree = renderWithTheme(
      <StarFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
