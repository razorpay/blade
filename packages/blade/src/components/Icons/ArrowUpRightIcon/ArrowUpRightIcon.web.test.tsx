import ArrowUpRightIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<ArrowUpRightIcon />', () => {
  it('should render ArrowUpRightIcon', () => {
    const { container } = renderWithTheme(
      <ArrowUpRightIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
