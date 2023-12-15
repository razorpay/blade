import UmbrellaIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<UmbrellaIcon />', () => {
  it('should render UmbrellaIcon', () => {
    const { container } = renderWithTheme(
      <UmbrellaIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
