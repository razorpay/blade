import MinusIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<MinusIcon />', () => {
  it('should render MinusIcon', () => {
    const { container } = renderWithTheme(
      <MinusIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
