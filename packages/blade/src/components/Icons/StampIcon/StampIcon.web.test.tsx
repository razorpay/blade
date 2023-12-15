import StampIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<StampIcon />', () => {
  it('should render StampIcon', () => {
    const { container } = renderWithTheme(
      <StampIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
