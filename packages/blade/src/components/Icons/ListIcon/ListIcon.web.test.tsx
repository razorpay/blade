import ListIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<ListIcon />', () => {
  it('should render ListIcon', () => {
    const { container } = renderWithTheme(
      <ListIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
