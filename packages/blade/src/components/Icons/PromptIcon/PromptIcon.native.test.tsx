import PromptIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PromptIcon />', () => {
  it('should render PromptIcon', () => {
    const renderTree = renderWithTheme(
      <PromptIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
