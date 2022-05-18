import renderWithTheme from '../../../_helpers/testing/renderWithTheme.native';
import DollarIcon from '.';

describe('<DollarIcon />', () => {
  it('should render DollarIcon', () => {
    const renderTree = renderWithTheme(
      <DollarIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
