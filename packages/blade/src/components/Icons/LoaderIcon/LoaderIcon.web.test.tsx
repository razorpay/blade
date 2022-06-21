import renderWithTheme from '../../../_helpers/testing/renderWithTheme.web';
import LoaderIcon from '.';

describe('<LoaderIcon />', () => {
  it('should render LoaderIcon', () => {
    const { container } = renderWithTheme(
      <LoaderIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
