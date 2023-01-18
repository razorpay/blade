import SmartCollectIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<SmartCollectIcon />', () => {
  it('should render SmartCollectIcon', () => {
    const { container } = renderWithTheme(
      <SmartCollectIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
