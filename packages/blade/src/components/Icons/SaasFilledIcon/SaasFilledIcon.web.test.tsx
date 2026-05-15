import renderWithTheme from '~utils/testing/renderWithTheme.web';

import SaasFilledIcon from './';

describe('<SaasFilledIcon />', () => {
  it('should render SaasFilledIcon', () => {
    const { container } = renderWithTheme(
      <SaasFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
