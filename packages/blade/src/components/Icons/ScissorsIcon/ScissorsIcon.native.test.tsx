import renderWithTheme from '~utils/testing/renderWithTheme.native';

import ScissorsIcon from './';

describe('<ScissorsIcon />', () => {
  it('should render ScissorsIcon', () => {
    const renderTree = renderWithTheme(
      <ScissorsIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
