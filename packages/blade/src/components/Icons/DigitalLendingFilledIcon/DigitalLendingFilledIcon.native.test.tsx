import DigitalLendingFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<DigitalLendingFilledIcon />', () => {
  it('should render DigitalLendingFilledIcon', () => {
    const renderTree = renderWithTheme(
      <DigitalLendingFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
