import EditInlineIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<EditInlineIcon />', () => {
  it('should render EditInlineIcon', () => {
    const { container } = renderWithTheme(
      <EditInlineIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
