import renderWithTheme from '~utils/testing/renderWithTheme.native';

import ChevronUpIcon from '.';

describe('<ChevronUpIcon />', () => {
  it('should render ChevronUpIcon', () => {
    const renderTree = renderWithTheme(
      <ChevronUpIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
