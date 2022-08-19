import ArrowDownIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<ArrowDownIcon />', () => {
  it('should render ArrowDownIcon', () => {
    const { container } = renderWithTheme(
      <ArrowDownIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
