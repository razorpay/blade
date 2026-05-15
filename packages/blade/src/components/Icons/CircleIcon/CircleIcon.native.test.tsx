import renderWithTheme from '~utils/testing/renderWithTheme.native';

import CircleIcon from '.';

describe('<CircleIcon />', () => {
  it('should render CircleIcon', () => {
    const renderTree = renderWithTheme(
      <CircleIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
