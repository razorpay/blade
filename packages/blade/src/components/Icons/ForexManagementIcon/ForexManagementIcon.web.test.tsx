import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ForexManagementIcon from './';

describe('<ForexManagementIcon />', () => {
  it('should render ForexManagementIcon', () => {
    const { container } = renderWithTheme(
      <ForexManagementIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
