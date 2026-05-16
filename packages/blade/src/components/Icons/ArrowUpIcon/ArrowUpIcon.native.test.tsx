import renderWithTheme from '~utils/testing/renderWithTheme.native';

import ArrowUpIcon from '.';

describe('<ArrowUpIcon />', () => {
  it('should render ArrowUpIcon', () => {
    const renderTree = renderWithTheme(
      <ArrowUpIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
