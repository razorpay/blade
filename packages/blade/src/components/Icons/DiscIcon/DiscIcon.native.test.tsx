import renderWithTheme from '~utils/testing/renderWithTheme.native';

import DiscIcon from '.';

describe('<DiscIcon />', () => {
  it('should render DiscIcon', () => {
    const renderTree = renderWithTheme(
      <DiscIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
