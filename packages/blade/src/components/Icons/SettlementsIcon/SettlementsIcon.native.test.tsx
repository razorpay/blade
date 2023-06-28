import SettlementsIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<SettlementsIcon />', () => {
  it('should render SettlementsIcon', () => {
    const renderTree = renderWithTheme(
      <SettlementsIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
