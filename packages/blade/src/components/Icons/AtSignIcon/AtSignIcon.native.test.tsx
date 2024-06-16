import AtSignIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<AtSignIcon />', () => {
  it('should render AtSignIcon', () => {
    const renderTree = renderWithTheme(
      <AtSignIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
