import renderWithTheme from '~utils/testing/renderWithTheme.web';

import CheckSquareIcon from './';

describe('<CheckSquareIcon />', () => {
  it('should render CheckSquareIcon', () => {
    const { container } = renderWithTheme(
      <CheckSquareIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
