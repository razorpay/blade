import renderWithTheme from '~utils/testing/renderWithTheme.native';

import CustomersIcon from './';

describe('<CustomersIcon />', () => {
  it('should render CustomersIcon', () => {
    const renderTree = renderWithTheme(
      <CustomersIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
