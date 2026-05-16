import renderWithTheme from '~utils/testing/renderWithTheme.native';

import ArrowSquareDownIcon from '.';

describe('<ArrowSquareDownIcon />', () => {
  it('should render ArrowSquareDownIcon', () => {
    const renderTree = renderWithTheme(
      <ArrowSquareDownIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
