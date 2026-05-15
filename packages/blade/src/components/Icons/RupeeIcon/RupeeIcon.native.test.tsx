import renderWithTheme from '~utils/testing/renderWithTheme.native';

import RupeeIcon from '.';

describe('<RupeeIcon />', () => {
  it('should render RupeeIcon', () => {
    const renderTree = renderWithTheme(
      <RupeeIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
