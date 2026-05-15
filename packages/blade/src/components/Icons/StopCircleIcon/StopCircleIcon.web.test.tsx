import renderWithTheme from '~utils/testing/renderWithTheme.web';

import StopCircleIcon from './';

describe('<StopCircleIcon />', () => {
  it('should render StopCircleIcon', () => {
    const { container } = renderWithTheme(
      <StopCircleIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
