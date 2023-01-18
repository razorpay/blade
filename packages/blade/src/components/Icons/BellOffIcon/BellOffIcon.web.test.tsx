import BellOffIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<BellOffIcon />', () => {
  it('should render BellOffIcon', () => {
    const { container } = renderWithTheme(
      <BellOffIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
