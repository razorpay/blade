import CheckIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<CheckIcon />', () => {
  it('should render CheckIcon', () => {
    const { container } = renderWithTheme(
      <CheckIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
