import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ZoomInIcon from './';

describe('<ZoomInIcon />', () => {
  it('should render ZoomInIcon', () => {
    const { container } = renderWithTheme(
      <ZoomInIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
