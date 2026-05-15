import renderWithTheme from '~utils/testing/renderWithTheme.native';

import PosFilledIcon from '.';

describe('<PosFilledIcon />', () => {
  it('should render PosFilledIcon', () => {
    const renderTree = renderWithTheme(
      <PosFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
