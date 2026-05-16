import renderWithTheme from '~utils/testing/renderWithTheme.web';

import PayrollForCaIcon from './';

describe('<PayrollForCaIcon />', () => {
  it('should render PayrollForCaIcon', () => {
    const { container } = renderWithTheme(
      <PayrollForCaIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
