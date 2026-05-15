import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ListIcon from './';

describe('<ListIcon />', () => {
  it('should render ListIcon', () => {
    const { container } = renderWithTheme(
      <ListIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
