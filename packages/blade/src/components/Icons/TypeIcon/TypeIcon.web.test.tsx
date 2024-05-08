import TypeIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<TypeIcon />', () => {
  it('should render TypeIcon', () => {
    const { container } = renderWithTheme(
      <TypeIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
