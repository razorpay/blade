import renderWithTheme from '~utils/testing/renderWithTheme.web';

import RayIcon from './';

describe('<RayIcon />', () => {
  it('should render RayIcon', () => {
    const { container } = renderWithTheme(
      <RayIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
