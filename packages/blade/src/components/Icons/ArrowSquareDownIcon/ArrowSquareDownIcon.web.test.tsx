import ArrowSquareDownIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ArrowSquareDownIcon />', () => {
  it('should render ArrowSquareDownIcon', () => {
    const { container } = renderWithTheme(
      <ArrowSquareDownIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
