import renderWithTheme from '~utils/testing/renderWithTheme.web';

import UnlockIcon from './';

describe('<UnlockIcon />', () => {
  it('should render UnlockIcon', () => {
    const { container } = renderWithTheme(
      <UnlockIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
