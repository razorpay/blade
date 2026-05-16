import renderWithTheme from '~utils/testing/renderWithTheme.web';

import CustomersIcon from './';

describe('<CustomersIcon />', () => {
  it('should render CustomersIcon', () => {
    const { container } = renderWithTheme(
      <CustomersIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
