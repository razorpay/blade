import renderWithTheme from '~utils/testing/renderWithTheme.native';

import ChevronRightIcon from '.';

describe('<ChevronRightIcon />', () => {
  it('should render ChevronRightIcon', () => {
    const renderTree = renderWithTheme(
      <ChevronRightIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
