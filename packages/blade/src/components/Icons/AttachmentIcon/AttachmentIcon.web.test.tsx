import AttachmentIcon from './';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

describe('<AttachmentIcon />', () => {
  it('should render AttachmentIcon', () => {
    const { container } = renderWithTheme(
      <AttachmentIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
