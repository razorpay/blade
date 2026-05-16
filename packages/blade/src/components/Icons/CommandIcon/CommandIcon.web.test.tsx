import renderWithTheme from '~utils/testing/renderWithTheme.web';

import CommandIcon from './';

describe('<CommandIcon />', () => {
  it('should render CommandIcon', () => {
    const { container } = renderWithTheme(
      <CommandIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
