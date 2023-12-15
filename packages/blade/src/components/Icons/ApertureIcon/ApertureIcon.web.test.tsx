import ApertureIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<ApertureIcon />', () => {
  it('should render ApertureIcon', () => {
    const { container } = renderWithTheme(
      <ApertureIcon color="feedback.icon.gray.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
