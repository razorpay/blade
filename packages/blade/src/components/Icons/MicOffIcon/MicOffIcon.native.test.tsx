import MicOffIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<MicOffIcon />', () => {
  it('should render MicOffIcon', () => {
    const renderTree = renderWithTheme(
      <MicOffIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
