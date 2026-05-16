import renderWithTheme from '~utils/testing/renderWithTheme.web';

import GridIcon from './';

describe('<GridIcon />', () => {
  it('should render GridIcon', () => {
    const { container } = renderWithTheme(
      <GridIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
