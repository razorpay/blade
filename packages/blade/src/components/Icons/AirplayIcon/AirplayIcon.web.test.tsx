import AirplayIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<AirplayIcon />', () => {
  it('should render AirplayIcon', () => {
    const { container } = renderWithTheme(
      <AirplayIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
