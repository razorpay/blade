import renderWithTheme from '~utils/testing/renderWithTheme.web';

import MinusCircleIcon from './';

describe('<MinusCircleIcon />', () => {
  it('should render MinusCircleIcon', () => {
    const { container } = renderWithTheme(
      <MinusCircleIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
