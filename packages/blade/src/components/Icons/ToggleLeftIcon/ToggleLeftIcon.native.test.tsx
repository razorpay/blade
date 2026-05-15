import renderWithTheme from '~utils/testing/renderWithTheme.native';

import ToggleLeftIcon from '.';

describe('<ToggleLeftIcon />', () => {
  it('should render ToggleLeftIcon', () => {
    const renderTree = renderWithTheme(
      <ToggleLeftIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
