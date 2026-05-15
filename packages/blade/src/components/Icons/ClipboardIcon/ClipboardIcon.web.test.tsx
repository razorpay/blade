import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ClipboardIcon from './';

describe('<ClipboardIcon />', () => {
  it('should render ClipboardIcon', () => {
    const { container } = renderWithTheme(
      <ClipboardIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
