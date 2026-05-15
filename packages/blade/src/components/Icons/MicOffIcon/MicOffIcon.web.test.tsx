import renderWithTheme from '~utils/testing/renderWithTheme.web';

import MicOffIcon from './';

describe('<MicOffIcon />', () => {
  it('should render MicOffIcon', () => {
    const { container } = renderWithTheme(
      <MicOffIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
