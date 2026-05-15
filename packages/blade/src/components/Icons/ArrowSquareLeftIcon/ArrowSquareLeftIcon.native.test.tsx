import renderWithTheme from '~utils/testing/renderWithTheme.native';

import ArrowSquareLeftIcon from '.';

describe('<ArrowSquareLeftIcon />', () => {
  it('should render ArrowSquareLeftIcon', () => {
    const renderTree = renderWithTheme(
      <ArrowSquareLeftIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
