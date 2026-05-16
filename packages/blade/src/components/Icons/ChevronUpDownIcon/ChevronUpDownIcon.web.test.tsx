import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ChevronUpDownIcon from './';

describe('<ChevronUpDownIcon />', () => {
  it('should render ChevronUpDownIcon', () => {
    const { container } = renderWithTheme(
      <ChevronUpDownIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
