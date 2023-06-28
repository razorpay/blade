import LoaderIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<LoaderIcon />', () => {
  it('should render LoaderIcon', () => {
    const { container } = renderWithTheme(
      <LoaderIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
