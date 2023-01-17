import ToggleRightIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<ToggleRightIcon />', () => {
  it('should render ToggleRightIcon', () => {
    const renderTree = renderWithTheme(
      <ToggleRightIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
