import renderWithTheme from '~utils/testing/renderWithTheme.web';

import CornerDownRightIcon from './';

describe('<CornerDownRightIcon />', () => {
  it('should render CornerDownRightIcon', () => {
    const { container } = renderWithTheme(
      <CornerDownRightIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
