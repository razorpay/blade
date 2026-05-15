import renderWithTheme from '~utils/testing/renderWithTheme.native';

import UpiAutopayFilledIcon from '.';

describe('<UpiAutopayFilledIcon />', () => {
  it('should render UpiAutopayFilledIcon', () => {
    const renderTree = renderWithTheme(
      <UpiAutopayFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
