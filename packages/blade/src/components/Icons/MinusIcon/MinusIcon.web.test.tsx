import renderWithTheme from '~utils/testing/renderWithTheme.web';

import MinusIcon from './';

describe('<MinusIcon />', () => {
  it('should render MinusIcon', () => {
    const { container } = renderWithTheme(
      <MinusIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
