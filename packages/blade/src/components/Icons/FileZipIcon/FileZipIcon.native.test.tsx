import renderWithTheme from '~utils/testing/renderWithTheme.native';

import FileZipIcon from '.';

describe('<FileZipIcon />', () => {
  it('should render FileZipIcon', () => {
    const renderTree = renderWithTheme(
      <FileZipIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
