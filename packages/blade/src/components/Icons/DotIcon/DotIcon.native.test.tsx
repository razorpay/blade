import DotIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<DotIcon />', () => {
  it('should render DotIcon', () => {
    const renderTree = renderWithTheme(
      <DotIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
