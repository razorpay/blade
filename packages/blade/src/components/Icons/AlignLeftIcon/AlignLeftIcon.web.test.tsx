import renderWithTheme from '~utils/testing/renderWithTheme.web';

import AlignLeftIcon from './';

describe('<AlignLeftIcon />', () => {
  it('should render AlignLeftIcon', () => {
    const { container } = renderWithTheme(
      <AlignLeftIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
