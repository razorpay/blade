import CpuIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<CpuIcon />', () => {
  it('should render CpuIcon', () => {
    const renderTree = renderWithTheme(
      <CpuIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
