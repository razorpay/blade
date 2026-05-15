import renderWithTheme from '~utils/testing/renderWithTheme.native';

import XCircleIcon from '.';

describe('<XCircleIcon />', () => {
  it('should render XCircleIcon', () => {
    const renderTree = renderWithTheme(
      <XCircleIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
