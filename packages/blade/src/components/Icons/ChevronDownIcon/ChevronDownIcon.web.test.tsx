import ChevronDownIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ChevronDownIcon />', () => {
  it('should render ChevronDownIcon', () => {
    const { container } = renderWithTheme(
      <ChevronDownIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
