import renderWithTheme from '~utils/testing/renderWithTheme.web';

import InstagramIcon from './';

describe('<InstagramIcon />', () => {
  it('should render InstagramIcon', () => {
    const { container } = renderWithTheme(
      <InstagramIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
