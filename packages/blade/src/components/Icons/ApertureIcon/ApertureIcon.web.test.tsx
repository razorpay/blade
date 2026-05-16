import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ApertureIcon from './';

describe('<ApertureIcon />', () => {
  it('should render ApertureIcon', () => {
    const { container } = renderWithTheme(
      <ApertureIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
