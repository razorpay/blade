import SimCardIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<SimCardIcon />', () => {
  it('should render SimCardIcon', () => {
    const renderTree = renderWithTheme(
      <SimCardIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
