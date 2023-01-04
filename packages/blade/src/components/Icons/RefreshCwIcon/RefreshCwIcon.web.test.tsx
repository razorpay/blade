import RefreshCwIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<RefreshCwIcon />', () => {
  it('should render RefreshCwIcon', () => {
    const { container } = renderWithTheme(
      <RefreshCwIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
