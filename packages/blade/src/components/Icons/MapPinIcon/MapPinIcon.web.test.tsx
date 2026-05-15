import renderWithTheme from '~utils/testing/renderWithTheme.web';

import MapPinIcon from './';

describe('<MapPinIcon />', () => {
  it('should render MapPinIcon', () => {
    const { container } = renderWithTheme(
      <MapPinIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
