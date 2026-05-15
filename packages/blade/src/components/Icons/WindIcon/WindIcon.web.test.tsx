import renderWithTheme from '~utils/testing/renderWithTheme.web';

import WindIcon from './';

describe('<WindIcon />', () => {
  it('should render WindIcon', () => {
    const { container } = renderWithTheme(
      <WindIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
