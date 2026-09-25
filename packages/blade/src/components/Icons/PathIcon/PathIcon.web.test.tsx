import PathIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<PathIcon />', () => {
  it('should render PathIcon', () => {
    const { container } = renderWithTheme(
      <PathIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
