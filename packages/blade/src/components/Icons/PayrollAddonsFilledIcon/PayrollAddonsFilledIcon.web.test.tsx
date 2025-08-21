import PayrollAddonsFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PayrollAddonsFilledIcon />', () => {
  it('should render PayrollAddonsFilledIcon', () => {
    const { container } = renderWithTheme(
      <PayrollAddonsFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
