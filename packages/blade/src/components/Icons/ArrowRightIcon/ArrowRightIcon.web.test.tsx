import ArrowRightIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<ArrowRightIcon />', () => {
  it('should render ArrowRightIcon', () => {
    const { container } = renderWithTheme(
      <ArrowRightIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
