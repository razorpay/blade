import renderWithTheme from '~utils/testing/renderWithTheme.native';

import EditIcon from '.';

describe('<EditIcon />', () => {
  it('should render EditIcon', () => {
    const renderTree = renderWithTheme(
      <EditIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
