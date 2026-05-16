import renderWithTheme from '~utils/testing/renderWithTheme.web';

import LockIcon from './';

describe('<LockIcon />', () => {
  it('should render LockIcon', () => {
    const { container } = renderWithTheme(
      <LockIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
