import renderWithTheme from '~utils/testing/renderWithTheme.native';

import PlusSquareIcon from '.';

describe('<PlusSquareIcon />', () => {
  it('should render PlusSquareIcon', () => {
    const renderTree = renderWithTheme(
      <PlusSquareIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
