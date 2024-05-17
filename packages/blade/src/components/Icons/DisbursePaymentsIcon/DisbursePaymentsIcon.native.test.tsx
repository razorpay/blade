import DisbursePaymentsIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<DisbursePaymentsIcon />', () => {
  it('should render DisbursePaymentsIcon', () => {
    const renderTree = renderWithTheme(
      <DisbursePaymentsIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
