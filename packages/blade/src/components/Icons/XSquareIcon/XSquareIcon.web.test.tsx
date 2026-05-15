import renderWithTheme from '~utils/testing/renderWithTheme.web';

import XSquareIcon from './';

describe('<XSquareIcon />', () => {
  it('should render XSquareIcon', () => {
    const { container } = renderWithTheme(
      <XSquareIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
