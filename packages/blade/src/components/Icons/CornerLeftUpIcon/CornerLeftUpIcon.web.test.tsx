import renderWithTheme from '~utils/testing/renderWithTheme.web';

import CornerLeftUpIcon from './';

describe('<CornerLeftUpIcon />', () => {
  it('should render CornerLeftUpIcon', () => {
    const { container } = renderWithTheme(
      <CornerLeftUpIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
