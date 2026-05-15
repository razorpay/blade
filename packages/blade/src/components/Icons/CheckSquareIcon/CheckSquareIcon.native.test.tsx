import renderWithTheme from '~utils/testing/renderWithTheme.native';

import CheckSquareIcon from '.';

describe('<CheckSquareIcon />', () => {
  it('should render CheckSquareIcon', () => {
    const renderTree = renderWithTheme(
      <CheckSquareIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
