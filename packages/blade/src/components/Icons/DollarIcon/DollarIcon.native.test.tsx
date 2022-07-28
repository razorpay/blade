import DollarIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<DollarIcon />', () => {
  it('should render DollarIcon', () => {
    const renderTree = renderWithTheme(
      <DollarIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
