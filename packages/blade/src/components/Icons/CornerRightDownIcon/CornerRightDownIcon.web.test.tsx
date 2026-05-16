import renderWithTheme from '~utils/testing/renderWithTheme.web';

import CornerRightDownIcon from './';

describe('<CornerRightDownIcon />', () => {
  it('should render CornerRightDownIcon', () => {
    const { container } = renderWithTheme(
      <CornerRightDownIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
