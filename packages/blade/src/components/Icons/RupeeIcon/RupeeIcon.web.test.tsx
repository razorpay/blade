import renderWithTheme from '~utils/testing/renderWithTheme.web';

import RupeeIcon from '.';

describe('<RupeeIcon />', () => {
  it('should render RupeeIcon', () => {
    const { container } = renderWithTheme(
      <RupeeIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
