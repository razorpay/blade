import renderWithTheme from '~utils/testing/renderWithTheme.native';

import FlaskIcon from '.';

describe('<FlaskIcon />', () => {
  it('should render FlaskIcon', () => {
    const renderTree = renderWithTheme(
      <FlaskIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
