import renderWithTheme from '~utils/testing/renderWithTheme.web';

import EngageIcon from './';

describe('<EngageIcon />', () => {
  it('should render EngageIcon', () => {
    const { container } = renderWithTheme(
      <EngageIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
