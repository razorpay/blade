import renderWithTheme from '~utils/testing/renderWithTheme.native';

import HeartIcon from '.';

describe('<HeartIcon />', () => {
  it('should render HeartIcon', () => {
    const renderTree = renderWithTheme(
      <HeartIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
