import renderWithTheme from '~utils/testing/renderWithTheme.web';

import CornerUpRightIcon from './';

describe('<CornerUpRightIcon />', () => {
  it('should render CornerUpRightIcon', () => {
    const { container } = renderWithTheme(
      <CornerUpRightIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
