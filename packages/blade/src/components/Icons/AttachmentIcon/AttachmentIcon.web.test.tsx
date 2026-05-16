import renderWithTheme from '~utils/testing/renderWithTheme.web';

import AttachmentIcon from './';

describe('<AttachmentIcon />', () => {
  it('should render AttachmentIcon', () => {
    const { container } = renderWithTheme(
      <AttachmentIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
