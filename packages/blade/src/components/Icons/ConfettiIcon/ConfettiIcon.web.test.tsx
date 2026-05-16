import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ConfettiIcon from './';

describe('<ConfettiIcon />', () => {
  it('should render ConfettiIcon', () => {
    const { container } = renderWithTheme(
      <ConfettiIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
