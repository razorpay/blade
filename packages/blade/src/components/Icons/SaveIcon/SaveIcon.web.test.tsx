import renderWithTheme from '~utils/testing/renderWithTheme.web';

import SaveIcon from './';

describe('<SaveIcon />', () => {
  it('should render SaveIcon', () => {
    const { container } = renderWithTheme(
      <SaveIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
