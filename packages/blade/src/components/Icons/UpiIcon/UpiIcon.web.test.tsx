import UpiIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<UpiIcon />', () => {
  it('should render UpiIcon', () => {
    const { container } = renderWithTheme(
      <UpiIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
