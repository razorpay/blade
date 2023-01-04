import RefreshCcwIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<RefreshCcwIcon />', () => {
  it('should render RefreshCcwIcon', () => {
    const renderTree = renderWithTheme(
      <RefreshCcwIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
