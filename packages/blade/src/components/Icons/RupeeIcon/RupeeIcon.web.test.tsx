import RupeeIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<RupeeIcon />', () => {
  it('should render RupeeIcon', () => {
    const { container } = renderWithTheme(
      <RupeeIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
