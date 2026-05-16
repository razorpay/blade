import renderWithTheme from '~utils/testing/renderWithTheme.native';

import MicIcon from '.';

describe('<MicIcon />', () => {
  it('should render MicIcon', () => {
    const renderTree = renderWithTheme(
      <MicIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
