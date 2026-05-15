import renderWithTheme from '~utils/testing/renderWithTheme.web';

import AndroidIcon from './';

describe('<AndroidIcon />', () => {
  it('should render AndroidIcon', () => {
    const { container } = renderWithTheme(
      <AndroidIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
