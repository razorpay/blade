import renderWithTheme from '~utils/testing/renderWithTheme.web';

import LifeBuoyIcon from './';

describe('<LifeBuoyIcon />', () => {
  it('should render LifeBuoyIcon', () => {
    const { container } = renderWithTheme(
      <LifeBuoyIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
