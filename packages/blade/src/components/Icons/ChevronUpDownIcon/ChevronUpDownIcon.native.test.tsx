import renderWithTheme from '~utils/testing/renderWithTheme.native';

import ChevronUpDownIcon from '.';

describe('<ChevronUpDownIcon />', () => {
  it('should render ChevronUpDownIcon', () => {
    const renderTree = renderWithTheme(
      <ChevronUpDownIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
