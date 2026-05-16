import renderWithTheme from '~utils/testing/renderWithTheme.native';

import PromptIcon from '.';

describe('<PromptIcon />', () => {
  it('should render PromptIcon', () => {
    const renderTree = renderWithTheme(
      <PromptIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
