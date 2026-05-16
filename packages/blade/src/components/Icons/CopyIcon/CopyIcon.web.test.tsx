import renderWithTheme from '~utils/testing/renderWithTheme.web';

import CopyIcon from './';

describe('<CopyIcon />', () => {
  it('should render CopyIcon', () => {
    const { container } = renderWithTheme(
      <CopyIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
