import renderWithTheme from '~utils/testing/renderWithTheme.native';

import SlashIcon from '.';

describe('<SlashIcon />', () => {
  it('should render SlashIcon', () => {
    const renderTree = renderWithTheme(
      <SlashIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
