import renderWithTheme from '~utils/testing/renderWithTheme.web';

import FullScreenEnterIcon from './';

describe('<FullScreenEnterIcon />', () => {
  it('should render FullScreenEnterIcon', () => {
    const { container } = renderWithTheme(
      <FullScreenEnterIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
