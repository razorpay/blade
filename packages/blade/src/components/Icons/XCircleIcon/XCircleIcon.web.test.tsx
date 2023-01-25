import XCircleIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<XCircleIcon />', () => {
  it('should render XCircleIcon', () => {
    const { container } = renderWithTheme(
      <XCircleIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
