import renderWithTheme from '~utils/testing/renderWithTheme.native';

import MinusCircleIcon from '.';

describe('<MinusCircleIcon />', () => {
  it('should render MinusCircleIcon', () => {
    const renderTree = renderWithTheme(
      <MinusCircleIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
