import renderWithTheme from '~utils/testing/renderWithTheme.native';

import ArrowSquareDownRightIcon from '.';

describe('<ArrowSquareDownRightIcon />', () => {
  it('should render ArrowSquareDownRightIcon', () => {
    const renderTree = renderWithTheme(
      <ArrowSquareDownRightIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
