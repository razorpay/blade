import renderWithTheme from '~utils/testing/renderWithTheme.web';

import CheckCircle2Icon from './';

describe('<CheckCircle2Icon />', () => {
  it('should render CheckCircle2Icon', () => {
    const { container } = renderWithTheme(
      <CheckCircle2Icon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
