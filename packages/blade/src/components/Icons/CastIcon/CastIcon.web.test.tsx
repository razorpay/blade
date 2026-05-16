import renderWithTheme from '~utils/testing/renderWithTheme.web';

import CastIcon from './';

describe('<CastIcon />', () => {
  it('should render CastIcon', () => {
    const { container } = renderWithTheme(
      <CastIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
