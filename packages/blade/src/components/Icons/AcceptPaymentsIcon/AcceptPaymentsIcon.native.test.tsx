import renderWithTheme from '~utils/testing/renderWithTheme.native';

import AcceptPaymentsIcon from '.';

describe('<AcceptPaymentsIcon />', () => {
  it('should render AcceptPaymentsIcon', () => {
    const renderTree = renderWithTheme(
      <AcceptPaymentsIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
