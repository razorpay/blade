import AlertOnlyIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<AlertOnlyIcon />', () => {
  it('should render AlertOnlyIcon', () => {
    const renderTree = renderWithTheme(
      <AlertOnlyIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
