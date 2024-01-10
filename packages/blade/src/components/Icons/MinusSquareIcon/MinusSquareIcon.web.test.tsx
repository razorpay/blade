import MinusSquareIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<MinusSquareIcon />', () => {
  it('should render MinusSquareIcon', () => {
    const { container } = renderWithTheme(
      <MinusSquareIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
