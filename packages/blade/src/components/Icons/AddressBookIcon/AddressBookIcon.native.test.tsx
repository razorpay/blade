import renderWithTheme from '~utils/testing/renderWithTheme.native';

import AddressBookIcon from '.';

describe('<AddressBookIcon />', () => {
  it('should render AddressBookIcon', () => {
    const renderTree = renderWithTheme(
      <AddressBookIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
