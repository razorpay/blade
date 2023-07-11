import AppStoreIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<AppStoreIcon />', () => {
  it('should render AppStoreIcon', () => {
    const { container } = renderWithTheme(
      <AppStoreIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
