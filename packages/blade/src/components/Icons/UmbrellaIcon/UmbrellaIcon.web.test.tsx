import UmbrellaIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<UmbrellaIcon />', () => {
  it('should render UmbrellaIcon', () => {
    const { container } = renderWithTheme(
      <UmbrellaIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
