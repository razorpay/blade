import renderWithTheme from '~utils/testing/renderWithTheme.web';

import FreelanceIcon from './';

describe('<FreelanceIcon />', () => {
  it('should render FreelanceIcon', () => {
    const { container } = renderWithTheme(
      <FreelanceIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
