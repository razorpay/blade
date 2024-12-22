import Battery20PercentIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<Battery20PercentIcon />', () => {
  it('should render Battery20PercentIcon', () => {
    const { container } = renderWithTheme(
      <Battery20PercentIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
