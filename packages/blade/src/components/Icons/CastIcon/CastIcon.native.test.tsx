import renderWithTheme from '~utils/testing/renderWithTheme.native';

import CastIcon from '.';

describe('<CastIcon />', () => {
  it('should render CastIcon', () => {
    const renderTree = renderWithTheme(
      <CastIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
