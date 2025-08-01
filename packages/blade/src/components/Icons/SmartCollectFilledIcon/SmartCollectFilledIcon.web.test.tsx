import SmartCollectFilledIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<SmartCollectFilledIcon />', () => {
  it('should render SmartCollectFilledIcon', () => {
    const { container } = renderWithTheme(
      <SmartCollectFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
