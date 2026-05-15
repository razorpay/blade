import renderWithTheme from '~utils/testing/renderWithTheme.web';

import DotIcon from './';

describe('<DotIcon />', () => {
  it('should render DotIcon', () => {
    const { container } = renderWithTheme(
      <DotIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
