import renderWithTheme from '~utils/testing/renderWithTheme.web';

import TypeIcon from './';

describe('<TypeIcon />', () => {
  it('should render TypeIcon', () => {
    const { container } = renderWithTheme(
      <TypeIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
