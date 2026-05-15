import renderWithTheme from '~utils/testing/renderWithTheme.web';

import MyAccountIcon from './';

describe('<MyAccountIcon />', () => {
  it('should render MyAccountIcon', () => {
    const { container } = renderWithTheme(
      <MyAccountIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
