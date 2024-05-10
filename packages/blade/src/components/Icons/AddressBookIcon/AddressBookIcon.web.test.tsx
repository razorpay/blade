import AddressBookIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<AddressBookIcon />', () => {
  it('should render AddressBookIcon', () => {
    const { container } = renderWithTheme(
      <AddressBookIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
