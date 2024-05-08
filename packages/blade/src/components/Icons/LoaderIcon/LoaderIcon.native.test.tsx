import LoaderIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<LoaderIcon />', () => {
  it('should render LoaderIcon', () => {
    const renderTree = renderWithTheme(
      <LoaderIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
