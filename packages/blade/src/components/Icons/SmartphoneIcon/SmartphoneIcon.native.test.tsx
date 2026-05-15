import renderWithTheme from '~utils/testing/renderWithTheme.native';

import SmartphoneIcon from '.';

describe('<SmartphoneIcon />', () => {
  it('should render SmartphoneIcon', () => {
    const renderTree = renderWithTheme(
      <SmartphoneIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
