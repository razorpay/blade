import renderWithTheme from '~utils/testing/renderWithTheme.web';

import AppStoreIcon from './';

describe('<AppStoreIcon />', () => {
  it('should render AppStoreIcon', () => {
    const { container } = renderWithTheme(
      <AppStoreIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
