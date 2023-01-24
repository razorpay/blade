import CpuIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<CpuIcon />', () => {
  it('should render CpuIcon', () => {
    const { container } = renderWithTheme(
      <CpuIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
