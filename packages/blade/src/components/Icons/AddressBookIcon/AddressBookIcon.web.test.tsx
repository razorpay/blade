import renderWithTheme from '~utils/testing/renderWithTheme.web';

import AddressBookIcon from './';

describe('<AddressBookIcon />', () => {
  it('should render AddressBookIcon', () => {
    const { container } = renderWithTheme(
      <AddressBookIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
