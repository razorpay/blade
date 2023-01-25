import UserPlusIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<UserPlusIcon />', () => {
  it('should render UserPlusIcon', () => {
    const { container } = renderWithTheme(
      <UserPlusIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
