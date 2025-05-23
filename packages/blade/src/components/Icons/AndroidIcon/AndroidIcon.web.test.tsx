import AndroidIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<AndroidIcon />', () => {
  it('should render AndroidIcon', () => {
    const { container } = renderWithTheme(
      <AndroidIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
