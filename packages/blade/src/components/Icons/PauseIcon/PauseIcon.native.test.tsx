import renderWithTheme from '../../../_helpers/testing/renderWithTheme.native';
import PauseIcon from '.';

describe('<PauseIcon />', () => {
  it('should render PauseIcon', () => {
    const renderTree = renderWithTheme(
      <PauseIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
