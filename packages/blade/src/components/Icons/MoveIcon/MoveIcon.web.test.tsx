import renderWithTheme from '~utils/testing/renderWithTheme.web';

import MoveIcon from './';

describe('<MoveIcon />', () => {
  it('should render MoveIcon', () => {
    const { container } = renderWithTheme(
      <MoveIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
