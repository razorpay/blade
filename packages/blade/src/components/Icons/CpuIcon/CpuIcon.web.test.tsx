import renderWithTheme from '~utils/testing/renderWithTheme.web';

import CpuIcon from './';

describe('<CpuIcon />', () => {
  it('should render CpuIcon', () => {
    const { container } = renderWithTheme(
      <CpuIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
