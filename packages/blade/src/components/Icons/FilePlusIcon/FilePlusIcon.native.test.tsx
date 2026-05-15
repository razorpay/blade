import renderWithTheme from '~utils/testing/renderWithTheme.native';

import FilePlusIcon from '.';

describe('<FilePlusIcon />', () => {
  it('should render FilePlusIcon', () => {
    const renderTree = renderWithTheme(
      <FilePlusIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
