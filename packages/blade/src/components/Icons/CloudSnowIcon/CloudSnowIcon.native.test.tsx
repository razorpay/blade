import renderWithTheme from '~utils/testing/renderWithTheme.native';

import CloudSnowIcon from '.';

describe('<CloudSnowIcon />', () => {
  it('should render CloudSnowIcon', () => {
    const renderTree = renderWithTheme(
      <CloudSnowIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
