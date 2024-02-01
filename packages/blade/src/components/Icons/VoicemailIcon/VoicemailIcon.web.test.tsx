import VoicemailIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<VoicemailIcon />', () => {
  it('should render VoicemailIcon', () => {
    const { container } = renderWithTheme(
      <VoicemailIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
