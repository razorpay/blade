import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ChevronDownIcon from './';

describe('<ChevronDownIcon />', () => {
  it('should render ChevronDownIcon', () => {
    const { container } = renderWithTheme(
      <ChevronDownIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
