import SkipBackIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<SkipBackIcon />', () => {
  it('should render SkipBackIcon', () => {
    const { container } = renderWithTheme(
      <SkipBackIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
