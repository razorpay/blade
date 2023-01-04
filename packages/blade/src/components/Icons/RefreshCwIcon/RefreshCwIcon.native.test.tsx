import RefreshCwIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<RefreshCwIcon />', () => {
  it('should render RefreshCwIcon', () => {
    const renderTree = renderWithTheme(
      <RefreshCwIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
