import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ForexManagementFilledIcon from './';

describe('<ForexManagementFilledIcon />', () => {
  it('should render ForexManagementFilledIcon', () => {
    const { container } = renderWithTheme(
      <ForexManagementFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
