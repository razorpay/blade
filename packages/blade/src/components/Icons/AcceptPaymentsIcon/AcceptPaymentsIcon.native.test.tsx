import AcceptPaymentsIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<AcceptPaymentsIcon />', () => {
  it('should render AcceptPaymentsIcon', () => {
    const renderTree = renderWithTheme(
      <AcceptPaymentsIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
