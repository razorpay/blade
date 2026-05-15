import renderWithTheme from '~utils/testing/renderWithTheme.native';

import ArrowSquareUpLeftIcon from '.';

describe('<ArrowSquareUpLeftIcon />', () => {
  it('should render ArrowSquareUpLeftIcon', () => {
    const renderTree = renderWithTheme(
      <ArrowSquareUpLeftIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
