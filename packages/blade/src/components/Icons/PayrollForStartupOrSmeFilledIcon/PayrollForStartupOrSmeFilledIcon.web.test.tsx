import renderWithTheme from '~utils/testing/renderWithTheme.web';

import PayrollForStartupOrSmeFilledIcon from './';

describe('<PayrollForStartupOrSmeFilledIcon />', () => {
  it('should render PayrollForStartupOrSmeFilledIcon', () => {
    const { container } = renderWithTheme(
      <PayrollForStartupOrSmeFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
