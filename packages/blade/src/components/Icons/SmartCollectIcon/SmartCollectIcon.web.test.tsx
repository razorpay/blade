import renderWithTheme from '~utils/testing/renderWithTheme.web';

import SmartCollectIcon from './';

describe('<SmartCollectIcon />', () => {
  it('should render SmartCollectIcon', () => {
    const { container } = renderWithTheme(
      <SmartCollectIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
