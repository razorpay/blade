import renderWithTheme from '~utils/testing/renderWithTheme.native';

import UnderlineIcon from '.';

describe('<UnderlineIcon />', () => {
  it('should render UnderlineIcon', () => {
    const renderTree = renderWithTheme(
      <UnderlineIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
