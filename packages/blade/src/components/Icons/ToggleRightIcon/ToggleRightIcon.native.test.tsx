import renderWithTheme from '~utils/testing/renderWithTheme.native';

import ToggleRightIcon from '.';

describe('<ToggleRightIcon />', () => {
  it('should render ToggleRightIcon', () => {
    const renderTree = renderWithTheme(
      <ToggleRightIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
