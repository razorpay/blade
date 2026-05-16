import renderWithTheme from '~utils/testing/renderWithTheme.web';

import PosIcon from './';

describe('<PosIcon />', () => {
  it('should render PosIcon', () => {
    const { container } = renderWithTheme(
      <PosIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
