import VoicemailIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<VoicemailIcon />', () => {
  it('should render VoicemailIcon', () => {
    const renderTree = renderWithTheme(
      <VoicemailIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
