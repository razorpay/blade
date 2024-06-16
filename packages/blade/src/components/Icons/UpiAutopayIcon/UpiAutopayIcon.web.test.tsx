import UpiAutopayIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<UpiAutopayIcon />', () => {
  it('should render UpiAutopayIcon', () => {
    const { container } = renderWithTheme(
      <UpiAutopayIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
