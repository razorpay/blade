import RupeeIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<RupeeIcon />', () => {
  it('should render RupeeIcon', () => {
    const { container } = renderWithTheme(
      <RupeeIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
