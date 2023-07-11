import SpeakerIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<SpeakerIcon />', () => {
  it('should render SpeakerIcon', () => {
    const { container } = renderWithTheme(
      <SpeakerIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
