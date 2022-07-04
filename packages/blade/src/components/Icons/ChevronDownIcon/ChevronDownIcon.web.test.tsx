import ChevronDownIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<ChevronDownIcon />', () => {
  it('should render ChevronDownIcon', () => {
    const { container } = renderWithTheme(
      <ChevronDownIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
