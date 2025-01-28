import Battery60PercentIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<Battery60PercentIcon />', () => {
  it('should render Battery60PercentIcon', () => {
    const { container } = renderWithTheme(
      <Battery60PercentIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
