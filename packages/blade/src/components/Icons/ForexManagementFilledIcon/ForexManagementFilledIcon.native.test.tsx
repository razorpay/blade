import renderWithTheme from '~utils/testing/renderWithTheme.native';

import ForexManagementFilledIcon from '.';

describe('<ForexManagementFilledIcon />', () => {
  it('should render ForexManagementFilledIcon', () => {
    const renderTree = renderWithTheme(
      <ForexManagementFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
