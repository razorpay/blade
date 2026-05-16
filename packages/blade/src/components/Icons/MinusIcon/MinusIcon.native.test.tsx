import renderWithTheme from '~utils/testing/renderWithTheme.native';

import MinusIcon from '.';

describe('<MinusIcon />', () => {
  it('should render MinusIcon', () => {
    const renderTree = renderWithTheme(
      <MinusIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
