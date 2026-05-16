import renderWithTheme from '~utils/testing/renderWithTheme.native';

import DigitalLendingIcon from '.';

describe('<DigitalLendingIcon />', () => {
  it('should render DigitalLendingIcon', () => {
    const renderTree = renderWithTheme(
      <DigitalLendingIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
