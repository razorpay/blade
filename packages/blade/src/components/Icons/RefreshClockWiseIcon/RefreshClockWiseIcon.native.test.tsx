import RefreshClockWiseIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<RefreshClockWiseIcon />', () => {
  it('should render RefreshClockWiseIcon', () => {
    const renderTree = renderWithTheme(
      <RefreshClockWiseIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
