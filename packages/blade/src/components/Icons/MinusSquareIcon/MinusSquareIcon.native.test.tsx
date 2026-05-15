import renderWithTheme from '~utils/testing/renderWithTheme.native';

import MinusSquareIcon from '.';

describe('<MinusSquareIcon />', () => {
  it('should render MinusSquareIcon', () => {
    const renderTree = renderWithTheme(
      <MinusSquareIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
