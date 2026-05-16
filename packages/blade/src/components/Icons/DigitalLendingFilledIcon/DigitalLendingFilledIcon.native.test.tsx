import renderWithTheme from '~utils/testing/renderWithTheme.native';

import DigitalLendingFilledIcon from '.';

describe('<DigitalLendingFilledIcon />', () => {
  it('should render DigitalLendingFilledIcon', () => {
    const renderTree = renderWithTheme(
      <DigitalLendingFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
