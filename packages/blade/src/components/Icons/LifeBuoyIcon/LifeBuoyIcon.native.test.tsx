import renderWithTheme from '~utils/testing/renderWithTheme.native';

import LifeBuoyIcon from '.';

describe('<LifeBuoyIcon />', () => {
  it('should render LifeBuoyIcon', () => {
    const renderTree = renderWithTheme(
      <LifeBuoyIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
