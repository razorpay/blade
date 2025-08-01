import PayrollAddonsFilledIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<PayrollAddonsFilledIcon />', () => {
  it('should render PayrollAddonsFilledIcon', () => {
    const renderTree = renderWithTheme(
      <PayrollAddonsFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
