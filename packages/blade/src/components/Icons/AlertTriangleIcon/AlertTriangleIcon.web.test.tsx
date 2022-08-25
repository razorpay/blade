import AlertIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<AlertIcon />', () => {
  it('should render AlertIcon', () => {
    const { container } = renderWithTheme(
      <AlertIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
