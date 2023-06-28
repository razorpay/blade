import PowerIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PowerIcon />', () => {
  it('should render PowerIcon', () => {
    const { container } = renderWithTheme(
      <PowerIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
