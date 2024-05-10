import AddressBookIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<AddressBookIcon />', () => {
  it('should render AddressBookIcon', () => {
    const renderTree = renderWithTheme(
      <AddressBookIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
