import PayrollAddonsIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PayrollAddonsIcon />', () => {
  it('should render PayrollAddonsIcon', () => {
    const { container } = renderWithTheme(
      <PayrollAddonsIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
