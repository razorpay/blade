import renderWithTheme from '~utils/testing/renderWithTheme.web';

import FreelanceFilledIcon from './';

describe('<FreelanceFilledIcon />', () => {
  it('should render FreelanceFilledIcon', () => {
    const { container } = renderWithTheme(
      <FreelanceFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
