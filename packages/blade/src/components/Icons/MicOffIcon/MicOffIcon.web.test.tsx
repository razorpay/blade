import MicOffIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<MicOffIcon />', () => {
  it('should render MicOffIcon', () => {
    const { container } = renderWithTheme(
      <MicOffIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
