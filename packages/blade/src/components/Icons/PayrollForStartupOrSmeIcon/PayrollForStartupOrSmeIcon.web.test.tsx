import renderWithTheme from '~utils/testing/renderWithTheme.web';

import PayrollForStartupOrSmeIcon from './';

describe('<PayrollForStartupOrSmeIcon />', () => {
  it('should render PayrollForStartupOrSmeIcon', () => {
    const { container } = renderWithTheme(
      <PayrollForStartupOrSmeIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
