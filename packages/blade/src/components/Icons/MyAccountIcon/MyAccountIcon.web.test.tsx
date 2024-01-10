import MyAccountIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<MyAccountIcon />', () => {
  it('should render MyAccountIcon', () => {
    const { container } = renderWithTheme(
      <MyAccountIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
