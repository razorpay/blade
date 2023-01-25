import MyAccountIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<MyAccountIcon />', () => {
  it('should render MyAccountIcon', () => {
    const { container } = renderWithTheme(
      <MyAccountIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
