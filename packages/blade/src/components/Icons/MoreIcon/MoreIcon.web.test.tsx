import renderWithTheme from '~utils/testing/renderWithTheme.web';

import MoreIcon from './';

describe('<MoreIcon />', () => {
  it('should render MoreIcon', () => {
    const { container } = renderWithTheme(
      <MoreIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
