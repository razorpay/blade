import renderWithTheme from '~utils/testing/renderWithTheme.native';

import FastForwardIcon from '.';

describe('<FastForwardIcon />', () => {
  it('should render FastForwardIcon', () => {
    const renderTree = renderWithTheme(
      <FastForwardIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
