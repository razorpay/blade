import renderWithTheme from '~utils/testing/renderWithTheme.native';

import CloseIcon from '.';

describe('<CloseIcon />', () => {
  it('should render CloseIcon', () => {
    const renderTree = renderWithTheme(
      <CloseIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
