import renderWithTheme from '~utils/testing/renderWithTheme.web';

import CheckIcon from './';

describe('<CheckIcon />', () => {
  it('should render CheckIcon', () => {
    const { container } = renderWithTheme(
      <CheckIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
