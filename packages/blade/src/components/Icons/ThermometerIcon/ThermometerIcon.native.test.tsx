import ThermometerIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ThermometerIcon />', () => {
  it('should render ThermometerIcon', () => {
    const renderTree = renderWithTheme(
      <ThermometerIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
