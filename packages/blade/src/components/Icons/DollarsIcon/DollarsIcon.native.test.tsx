import DollarsIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<DollarsIcon />', () => {
  it('should render DollarsIcon', () => {
    const renderTree = renderWithTheme(
      <DollarsIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
