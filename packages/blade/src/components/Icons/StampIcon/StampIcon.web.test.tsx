import renderWithTheme from '~utils/testing/renderWithTheme.web';

import StampIcon from './';

describe('<StampIcon />', () => {
  it('should render StampIcon', () => {
    const { container } = renderWithTheme(
      <StampIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
