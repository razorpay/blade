import MicIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<MicIcon />', () => {
  it('should render MicIcon', () => {
    const { container } = renderWithTheme(
      <MicIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
