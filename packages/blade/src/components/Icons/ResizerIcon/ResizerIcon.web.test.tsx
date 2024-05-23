import ResizerIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ResizerIcon />', () => {
  it('should render ResizerIcon', () => {
    const { container } = renderWithTheme(
      <ResizerIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
