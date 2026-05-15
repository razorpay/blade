import renderWithTheme from '~utils/testing/renderWithTheme.web';

import HelpCircleIcon from './';

describe('<HelpCircleIcon />', () => {
  it('should render HelpCircleIcon', () => {
    const { container } = renderWithTheme(
      <HelpCircleIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
