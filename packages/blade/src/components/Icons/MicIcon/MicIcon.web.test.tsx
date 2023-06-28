import MicIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<MicIcon />', () => {
  it('should render MicIcon', () => {
    const { container } = renderWithTheme(
      <MicIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
