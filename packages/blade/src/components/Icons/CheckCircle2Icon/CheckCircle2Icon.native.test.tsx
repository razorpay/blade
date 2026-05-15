import renderWithTheme from '~utils/testing/renderWithTheme.native';

import CheckCircle2Icon from '.';

describe('<CheckCircle2Icon />', () => {
  it('should render CheckCircle2Icon', () => {
    const renderTree = renderWithTheme(
      <CheckCircle2Icon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
