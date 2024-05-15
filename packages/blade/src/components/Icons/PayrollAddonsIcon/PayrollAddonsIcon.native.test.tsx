import PayrollAddonsIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PayrollAddonsIcon />', () => {
  it('should render PayrollAddonsIcon', () => {
    const renderTree = renderWithTheme(
      <PayrollAddonsIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
