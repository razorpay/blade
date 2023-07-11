import SpeakerIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<SpeakerIcon />', () => {
  it('should render SpeakerIcon', () => {
    const renderTree = renderWithTheme(
      <SpeakerIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
