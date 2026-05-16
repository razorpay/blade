import renderWithTheme from '~utils/testing/renderWithTheme.web';

import XCircleIcon from './';

describe('<XCircleIcon />', () => {
  it('should render XCircleIcon', () => {
    const { container } = renderWithTheme(
      <XCircleIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
