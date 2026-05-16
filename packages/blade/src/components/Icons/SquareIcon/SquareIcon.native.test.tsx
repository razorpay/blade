import renderWithTheme from '~utils/testing/renderWithTheme.native';

import SquareIcon from '.';

describe('<SquareIcon />', () => {
  it('should render SquareIcon', () => {
    const renderTree = renderWithTheme(
      <SquareIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
