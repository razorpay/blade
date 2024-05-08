import DigitalLendingIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<DigitalLendingIcon />', () => {
  it('should render DigitalLendingIcon', () => {
    const renderTree = renderWithTheme(
      <DigitalLendingIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
