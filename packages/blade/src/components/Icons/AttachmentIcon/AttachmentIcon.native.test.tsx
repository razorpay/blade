import AttachmentIcon from '.';
import renderWithTheme from '~utils/testing/renderWithTheme.native';

describe('<AttachmentIcon />', () => {
  it('should render AttachmentIcon', () => {
    const renderTree = renderWithTheme(
      <AttachmentIcon color="feedback.icon.gray.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
