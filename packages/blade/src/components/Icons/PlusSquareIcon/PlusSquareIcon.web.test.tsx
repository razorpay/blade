import renderWithTheme from '~utils/testing/renderWithTheme.web';

import PlusSquareIcon from './';

describe('<PlusSquareIcon />', () => {
  it('should render PlusSquareIcon', () => {
    const { container } = renderWithTheme(
      <PlusSquareIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
