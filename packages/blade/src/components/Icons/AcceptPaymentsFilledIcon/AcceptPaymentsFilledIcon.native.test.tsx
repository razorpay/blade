import renderWithTheme from '~utils/testing/renderWithTheme.native';

import AcceptPaymentsFilledIcon from '.';

describe('<AcceptPaymentsFilledIcon />', () => {
  it('should render AcceptPaymentsFilledIcon', () => {
    const renderTree = renderWithTheme(
      <AcceptPaymentsFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});
