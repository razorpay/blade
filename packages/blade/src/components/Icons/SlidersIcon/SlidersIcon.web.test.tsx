import renderWithTheme from '~utils/testing/renderWithTheme.web';

import SlidersIcon from './';

describe('<SlidersIcon />', () => {
  it('should render SlidersIcon', () => {
    const { container } = renderWithTheme(
      <SlidersIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
