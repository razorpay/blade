import RefreshCcwIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<RefreshCcwIcon />', () => {
  it('should render RefreshCcwIcon', () => {
    const { container } = renderWithTheme(
      <RefreshCcwIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
