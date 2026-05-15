import renderWithTheme from '~utils/testing/renderWithTheme.native';

import AttachmentIcon from '.';

describe('<AttachmentIcon />', () => {
  it('should render AttachmentIcon', () => {
    const renderTree = renderWithTheme(
      <AttachmentIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
