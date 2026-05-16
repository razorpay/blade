import renderWithTheme from '~utils/testing/renderWithTheme.web';

import MinusSquareIcon from './';

describe('<MinusSquareIcon />', () => {
  it('should render MinusSquareIcon', () => {
    const { container } = renderWithTheme(
      <MinusSquareIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
