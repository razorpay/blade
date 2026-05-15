import renderWithTheme from '~utils/testing/renderWithTheme.web';

import CornerUpLeftIcon from './';

describe('<CornerUpLeftIcon />', () => {
  it('should render CornerUpLeftIcon', () => {
    const { container } = renderWithTheme(
      <CornerUpLeftIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
