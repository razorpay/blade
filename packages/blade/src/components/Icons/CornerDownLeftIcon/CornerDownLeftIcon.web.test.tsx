import renderWithTheme from '~utils/testing/renderWithTheme.web';

import CornerDownLeftIcon from './';

describe('<CornerDownLeftIcon />', () => {
  it('should render CornerDownLeftIcon', () => {
    const { container } = renderWithTheme(
      <CornerDownLeftIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
