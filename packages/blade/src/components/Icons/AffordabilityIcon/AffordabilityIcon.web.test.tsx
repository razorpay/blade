import renderWithTheme from '~utils/testing/renderWithTheme.web';

import AffordabilityIcon from './';

describe('<AffordabilityIcon />', () => {
  it('should render AffordabilityIcon', () => {
    const { container } = renderWithTheme(
      <AffordabilityIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
