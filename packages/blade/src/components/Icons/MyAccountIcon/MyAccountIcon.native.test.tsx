import renderWithTheme from '~utils/testing/renderWithTheme.native';

import MyAccountIcon from './';

describe('<MyAccountIcon />', () => {
  it('should render MyAccountIcon', () => {
    const renderTree = renderWithTheme(
      <MyAccountIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
