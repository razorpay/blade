import ArrowUpIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ArrowUpIcon />', () => {
  it('should render ArrowUpIcon', () => {
    const { container } = renderWithTheme(
      <ArrowUpIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
