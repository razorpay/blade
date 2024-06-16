import EditComposeIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<EditComposeIcon />', () => {
  it('should render EditComposeIcon', () => {
    const renderTree = renderWithTheme(
      <EditComposeIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
