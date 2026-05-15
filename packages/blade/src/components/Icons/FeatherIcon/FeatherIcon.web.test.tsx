import renderWithTheme from '~utils/testing/renderWithTheme.web';

import FeatherIcon from './';

describe('<FeatherIcon />', () => {
  it('should render FeatherIcon', () => {
    const { container } = renderWithTheme(
      <FeatherIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
