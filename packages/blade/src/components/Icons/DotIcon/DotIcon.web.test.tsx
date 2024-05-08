import DotIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<DotIcon />', () => {
  it('should render DotIcon', () => {
    const { container } = renderWithTheme(
      <DotIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
