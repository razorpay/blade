import renderWithTheme from '~utils/testing/renderWithTheme.web';

import SaasIcon from './';

describe('<SaasIcon />', () => {
  it('should render SaasIcon', () => {
    const { container } = renderWithTheme(
      <SaasIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
