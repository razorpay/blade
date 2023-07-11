import XSquareIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<XSquareIcon />', () => {
  it('should render XSquareIcon', () => {
    const { container } = renderWithTheme(
      <XSquareIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
