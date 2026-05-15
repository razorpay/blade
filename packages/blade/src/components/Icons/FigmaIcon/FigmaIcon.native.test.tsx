import renderWithTheme from '~utils/testing/renderWithTheme.native';

import FigmaIcon from '.';

describe('<FigmaIcon />', () => {
  it('should render FigmaIcon', () => {
    const renderTree = renderWithTheme(
      <FigmaIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
