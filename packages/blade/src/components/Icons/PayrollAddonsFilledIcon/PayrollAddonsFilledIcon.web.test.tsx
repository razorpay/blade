import renderWithTheme from '~utils/testing/renderWithTheme.web';

import PayrollAddonsFilledIcon from './';

describe('<PayrollAddonsFilledIcon />', () => {
  it('should render PayrollAddonsFilledIcon', () => {
    const { container } = renderWithTheme(
      <PayrollAddonsFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
