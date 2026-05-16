import renderWithTheme from '~utils/testing/renderWithTheme.web';

import SpeakerIcon from './';

describe('<SpeakerIcon />', () => {
  it('should render SpeakerIcon', () => {
    const { container } = renderWithTheme(
      <SpeakerIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
