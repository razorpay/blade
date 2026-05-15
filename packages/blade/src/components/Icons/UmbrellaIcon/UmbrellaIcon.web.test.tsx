import renderWithTheme from '~utils/testing/renderWithTheme.web';

import UmbrellaIcon from './';

describe('<UmbrellaIcon />', () => {
  it('should render UmbrellaIcon', () => {
    const { container } = renderWithTheme(
      <UmbrellaIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
