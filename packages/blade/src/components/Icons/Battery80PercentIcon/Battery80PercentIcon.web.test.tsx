import Battery80PercentIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<Battery80PercentIcon />', () => {
  it('should render Battery80PercentIcon', () => {
    const { container } = renderWithTheme(
      <Battery80PercentIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
