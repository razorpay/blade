import renderWithTheme from '~utils/testing/renderWithTheme.native';

import CopyIcon from '.';

describe('<CopyIcon />', () => {
  it('should render CopyIcon', () => {
    const renderTree = renderWithTheme(
      <CopyIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
