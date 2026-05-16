import renderWithTheme from '~utils/testing/renderWithTheme.native';

import CpuIcon from '.';

describe('<CpuIcon />', () => {
  it('should render CpuIcon', () => {
    const renderTree = renderWithTheme(
      <CpuIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
