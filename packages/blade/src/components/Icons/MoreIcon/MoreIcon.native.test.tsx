import renderWithTheme from '~utils/testing/renderWithTheme.native';

import MoreIcon from '.';

describe('<MoreIcon />', () => {
  it('should render MoreIcon', () => {
    const renderTree = renderWithTheme(
      <MoreIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
