import renderWithTheme from '~utils/testing/renderWithTheme.native';

import PlusIcon from '.';

describe('<PlusIcon />', () => {
  it('should render PlusIcon', () => {
    const renderTree = renderWithTheme(
      <PlusIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
