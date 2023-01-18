import EditInlineIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<EditInlineIcon />', () => {
  it('should render EditInlineIcon', () => {
    const { container } = renderWithTheme(
      <EditInlineIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
