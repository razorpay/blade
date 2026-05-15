import renderWithTheme from '~utils/testing/renderWithTheme.native';

import CheckCircleIcon from '.';

describe('<CheckCircleIcon />', () => {
  it('should render CheckCircleIcon', () => {
    const renderTree = renderWithTheme(
      <CheckCircleIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
