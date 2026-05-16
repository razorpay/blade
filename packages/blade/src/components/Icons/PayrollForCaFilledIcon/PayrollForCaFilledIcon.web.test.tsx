import renderWithTheme from '~utils/testing/renderWithTheme.web';

import PayrollForCaFilledIcon from './';

describe('<PayrollForCaFilledIcon />', () => {
  it('should render PayrollForCaFilledIcon', () => {
    const { container } = renderWithTheme(
      <PayrollForCaFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
