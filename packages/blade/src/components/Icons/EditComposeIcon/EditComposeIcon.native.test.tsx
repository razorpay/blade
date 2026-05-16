import renderWithTheme from '~utils/testing/renderWithTheme.native';

import EditComposeIcon from '.';

describe('<EditComposeIcon />', () => {
  it('should render EditComposeIcon', () => {
    const renderTree = renderWithTheme(
      <EditComposeIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
