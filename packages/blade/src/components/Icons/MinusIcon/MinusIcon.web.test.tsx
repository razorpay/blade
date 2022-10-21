import MinusIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<MinusIcon />', () => {
  it('should render MinusIcon', () => {
    const { container } = renderWithTheme(
      <MinusIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
