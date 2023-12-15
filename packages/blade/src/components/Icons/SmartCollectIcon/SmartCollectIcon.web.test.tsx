import SmartCollectIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<SmartCollectIcon />', () => {
  it('should render SmartCollectIcon', () => {
    const { container } = renderWithTheme(
      <SmartCollectIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
