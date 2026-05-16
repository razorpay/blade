import renderWithTheme from '~utils/testing/renderWithTheme.native';

import StampIcon from '.';

describe('<StampIcon />', () => {
  it('should render StampIcon', () => {
    const renderTree = renderWithTheme(
      <StampIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
