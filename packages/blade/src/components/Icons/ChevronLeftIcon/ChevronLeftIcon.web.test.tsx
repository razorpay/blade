import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ChevronLeftIcon from './';

describe('<ChevronLeftIcon />', () => {
  it('should render ChevronLeftIcon', () => {
    const { container } = renderWithTheme(
      <ChevronLeftIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
