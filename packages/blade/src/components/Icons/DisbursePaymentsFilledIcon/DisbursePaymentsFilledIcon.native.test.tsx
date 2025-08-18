import DisbursePaymentsFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<DisbursePaymentsFilledIcon />', () => {
  it('should render DisbursePaymentsFilledIcon', () => {
    const renderTree = renderWithTheme(
      <DisbursePaymentsFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
