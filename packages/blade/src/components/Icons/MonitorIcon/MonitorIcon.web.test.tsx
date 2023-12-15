import MonitorIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<MonitorIcon />', () => {
  it('should render MonitorIcon', () => {
    const { container } = renderWithTheme(
      <MonitorIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
