import renderWithTheme from '~utils/testing/renderWithTheme.native';

import MoreFilledIcon from '.';

describe('<MoreFilledIcon />', () => {
  it('should render MoreFilledIcon', () => {
    const renderTree = renderWithTheme(
      <MoreFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
