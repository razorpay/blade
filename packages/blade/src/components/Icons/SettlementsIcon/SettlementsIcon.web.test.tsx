import SettlementsIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<SettlementsIcon />', () => {
  it('should render SettlementsIcon', () => {
    const { container } = renderWithTheme(
      <SettlementsIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
