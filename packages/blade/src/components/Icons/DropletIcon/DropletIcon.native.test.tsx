import renderWithTheme from '~utils/testing/renderWithTheme.native';

import DropletIcon from '.';

describe('<DropletIcon />', () => {
  it('should render DropletIcon', () => {
    const renderTree = renderWithTheme(
      <DropletIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
