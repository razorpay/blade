import renderWithTheme from '~utils/testing/renderWithTheme.web';

import EqualsIcon from './';

describe('<EqualsIcon />', () => {
  it('should render EqualsIcon', () => {
    const { container } = renderWithTheme(
      <EqualsIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
