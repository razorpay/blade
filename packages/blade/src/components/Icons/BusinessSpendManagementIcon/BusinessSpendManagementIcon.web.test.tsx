import renderWithTheme from '~utils/testing/renderWithTheme.web';

import BusinessSpendManagementIcon from './';

describe('<BusinessSpendManagementIcon />', () => {
  it('should render BusinessSpendManagementIcon', () => {
    const { container } = renderWithTheme(
      <BusinessSpendManagementIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
