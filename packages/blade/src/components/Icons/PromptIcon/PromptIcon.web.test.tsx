import renderWithTheme from '~utils/testing/renderWithTheme.web';

import PromptIcon from './';

describe('<PromptIcon />', () => {
  it('should render PromptIcon', () => {
    const { container } = renderWithTheme(
      <PromptIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
