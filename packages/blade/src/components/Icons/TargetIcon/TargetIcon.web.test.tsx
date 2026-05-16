import renderWithTheme from '~utils/testing/renderWithTheme.web';

import TargetIcon from './';

describe('<TargetIcon />', () => {
  it('should render TargetIcon', () => {
    const { container } = renderWithTheme(
      <TargetIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
