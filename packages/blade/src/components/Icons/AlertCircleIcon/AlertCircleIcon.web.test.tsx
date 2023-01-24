import AlertCircleIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<AlertCircleIcon />', () => {
  it('should render AlertCircleIcon', () => {
    const { container } = renderWithTheme(
      <AlertCircleIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
