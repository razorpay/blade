import ArrowLeftIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ArrowLeftIcon />', () => {
  it('should render ArrowLeftIcon', () => {
    const { container } = renderWithTheme(
      <ArrowLeftIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
