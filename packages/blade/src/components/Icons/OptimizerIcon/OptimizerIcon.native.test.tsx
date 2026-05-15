import renderWithTheme from '~utils/testing/renderWithTheme.native';

import OptimizerIcon from '.';

describe('<OptimizerIcon />', () => {
  it('should render OptimizerIcon', () => {
    const renderTree = renderWithTheme(
      <OptimizerIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
