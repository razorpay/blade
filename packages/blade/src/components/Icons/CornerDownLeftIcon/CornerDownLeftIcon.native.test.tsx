import renderWithTheme from '~utils/testing/renderWithTheme.native';

import CornerDownLeftIcon from '.';

describe('<CornerDownLeftIcon />', () => {
  it('should render CornerDownLeftIcon', () => {
    const renderTree = renderWithTheme(
      <CornerDownLeftIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
