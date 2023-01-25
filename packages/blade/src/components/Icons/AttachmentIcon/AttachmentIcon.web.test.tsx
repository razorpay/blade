import AttachmentIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<AttachmentIcon />', () => {
  it('should render AttachmentIcon', () => {
    const { container } = renderWithTheme(
      <AttachmentIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
