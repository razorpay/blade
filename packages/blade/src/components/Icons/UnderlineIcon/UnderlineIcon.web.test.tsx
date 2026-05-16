import renderWithTheme from '~utils/testing/renderWithTheme.web';

import UnderlineIcon from './';

describe('<UnderlineIcon />', () => {
  it('should render UnderlineIcon', () => {
    const { container } = renderWithTheme(
      <UnderlineIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
