import DollarIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<DollarIcon />', () => {
  it('should render DollarIcon', () => {
    const { container } = renderWithTheme(
      <DollarIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
