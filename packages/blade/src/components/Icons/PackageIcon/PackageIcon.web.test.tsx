import renderWithTheme from '~utils/testing/renderWithTheme.web';

import PackageIcon from './';

describe('<PackageIcon />', () => {
  it('should render PackageIcon', () => {
    const { container } = renderWithTheme(
      <PackageIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
