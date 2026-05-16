import renderWithTheme from '~utils/testing/renderWithTheme.web';

import OctagonIcon from './';

describe('<OctagonIcon />', () => {
  it('should render OctagonIcon', () => {
    const { container } = renderWithTheme(
      <OctagonIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
