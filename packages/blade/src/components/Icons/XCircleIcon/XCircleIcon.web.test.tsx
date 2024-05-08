import XCircleIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<XCircleIcon />', () => {
  it('should render XCircleIcon', () => {
    const { container } = renderWithTheme(
      <XCircleIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
