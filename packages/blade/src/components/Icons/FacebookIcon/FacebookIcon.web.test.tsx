import renderWithTheme from '~utils/testing/renderWithTheme.web';

import FacebookIcon from './';

describe('<FacebookIcon />', () => {
  it('should render FacebookIcon', () => {
    const { container } = renderWithTheme(
      <FacebookIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
