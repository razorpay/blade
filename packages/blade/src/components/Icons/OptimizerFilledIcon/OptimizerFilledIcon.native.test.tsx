import renderWithTheme from '~utils/testing/renderWithTheme.native';

import OptimizerFilledIcon from '.';

describe('<OptimizerFilledIcon />', () => {
  it('should render OptimizerFilledIcon', () => {
    const renderTree = renderWithTheme(
      <OptimizerFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
