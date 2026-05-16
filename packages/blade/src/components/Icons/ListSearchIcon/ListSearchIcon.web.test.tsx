import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ListSearchIcon from './';

describe('<ListSearchIcon />', () => {
  it('should render ListSearchIcon', () => {
    const { container } = renderWithTheme(
      <ListSearchIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
