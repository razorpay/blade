import renderWithTheme from '~utils/testing/renderWithTheme.web';

import MicIcon from './';

describe('<MicIcon />', () => {
  it('should render MicIcon', () => {
    const { container } = renderWithTheme(
      <MicIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
