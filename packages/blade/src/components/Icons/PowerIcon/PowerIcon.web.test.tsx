import renderWithTheme from '~utils/testing/renderWithTheme.web';

import PowerIcon from './';

describe('<PowerIcon />', () => {
  it('should render PowerIcon', () => {
    const { container } = renderWithTheme(
      <PowerIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
