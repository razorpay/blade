import Battery40PercentIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<Battery40PercentIcon />', () => {
  it('should render Battery40PercentIcon', () => {
    const { container } = renderWithTheme(
      <Battery40PercentIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
