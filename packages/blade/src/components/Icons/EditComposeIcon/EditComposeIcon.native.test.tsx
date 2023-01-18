import EditComposeIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<EditComposeIcon />', () => {
  it('should render EditComposeIcon', () => {
    const renderTree = renderWithTheme(
      <EditComposeIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
