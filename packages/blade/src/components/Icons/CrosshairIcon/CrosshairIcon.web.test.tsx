import renderWithTheme from '~utils/testing/renderWithTheme.web';

import CrosshairIcon from './';

describe('<CrosshairIcon />', () => {
  it('should render CrosshairIcon', () => {
    const { container } = renderWithTheme(
      <CrosshairIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
