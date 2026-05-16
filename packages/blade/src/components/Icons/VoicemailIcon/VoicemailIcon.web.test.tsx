import renderWithTheme from '~utils/testing/renderWithTheme.web';

import VoicemailIcon from './';

describe('<VoicemailIcon />', () => {
  it('should render VoicemailIcon', () => {
    const { container } = renderWithTheme(
      <VoicemailIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
