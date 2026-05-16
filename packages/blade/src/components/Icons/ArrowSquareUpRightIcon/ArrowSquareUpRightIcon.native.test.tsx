import renderWithTheme from '~utils/testing/renderWithTheme.native';

import ArrowSquareUpRightIcon from '.';

describe('<ArrowSquareUpRightIcon />', () => {
  it('should render ArrowSquareUpRightIcon', () => {
    const renderTree = renderWithTheme(
      <ArrowSquareUpRightIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
