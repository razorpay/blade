import renderWithTheme from '~utils/testing/renderWithTheme.native';

import SpeakerIcon from '.';

describe('<SpeakerIcon />', () => {
  it('should render SpeakerIcon', () => {
    const renderTree = renderWithTheme(
      <SpeakerIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
