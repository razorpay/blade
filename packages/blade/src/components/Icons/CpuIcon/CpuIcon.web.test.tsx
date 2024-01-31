import CpuIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<CpuIcon />', () => {
  it('should render CpuIcon', () => {
    const { container } = renderWithTheme(
      <CpuIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
