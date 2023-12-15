import DollarIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<DollarIcon />', () => {
  it('should render DollarIcon', () => {
    const { container } = renderWithTheme(
      <DollarIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
