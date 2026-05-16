import renderWithTheme from '~utils/testing/renderWithTheme.native';

import ExportIcon from '.';

describe('<ExportIcon />', () => {
  it('should render ExportIcon', () => {
    const renderTree = renderWithTheme(
      <ExportIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
