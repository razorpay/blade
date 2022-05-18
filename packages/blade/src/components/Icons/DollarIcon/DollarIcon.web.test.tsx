import renderWithTheme from '../../../_helpers/testing/renderWithTheme.web';
import DollarIcon from '.';

describe('<DollarIcon />', () => {
  it('should render DollarIcon', () => {
    const { container } = renderWithTheme(
      <DollarIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
