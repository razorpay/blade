import CpuIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<CpuIcon />', () => {
  it('should render CpuIcon', () => {
    const renderTree = renderWithTheme(
      <CpuIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
