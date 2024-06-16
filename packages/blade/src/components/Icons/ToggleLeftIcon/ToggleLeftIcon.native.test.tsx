import ToggleLeftIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<ToggleLeftIcon />', () => {
  it('should render ToggleLeftIcon', () => {
    const renderTree = renderWithTheme(
      <ToggleLeftIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
