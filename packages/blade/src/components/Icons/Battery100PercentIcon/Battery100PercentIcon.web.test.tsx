import Battery100PercentIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<Battery100PercentIcon />', () => {
  it('should render Battery100PercentIcon', () => {
    const { container } = renderWithTheme(
      <Battery100PercentIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
