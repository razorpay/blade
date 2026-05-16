import renderWithTheme from '~utils/testing/renderWithTheme.web';

import CloudRainIcon from './';

describe('<CloudRainIcon />', () => {
  it('should render CloudRainIcon', () => {
    const { container } = renderWithTheme(
      <CloudRainIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
