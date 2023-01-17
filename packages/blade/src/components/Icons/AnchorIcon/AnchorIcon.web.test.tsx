import AnchorIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<AnchorIcon />', () => {
  it('should render AnchorIcon', () => {
    const { container } = renderWithTheme(
      <AnchorIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
