import renderWithTheme from '~utils/testing/renderWithTheme.web';

import AutomateAccountingIcon from './';

describe('<AutomateAccountingIcon />', () => {
  it('should render AutomateAccountingIcon', () => {
    const { container } = renderWithTheme(
      <AutomateAccountingIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
