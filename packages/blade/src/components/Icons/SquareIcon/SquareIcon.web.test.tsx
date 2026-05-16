import renderWithTheme from '~utils/testing/renderWithTheme.web';

import SquareIcon from './';

describe('<SquareIcon />', () => {
  it('should render SquareIcon', () => {
    const { container } = renderWithTheme(
      <SquareIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
