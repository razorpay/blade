import renderWithTheme from '~utils/testing/renderWithTheme.web';

import CornerLeftDownIcon from './';

describe('<CornerLeftDownIcon />', () => {
  it('should render CornerLeftDownIcon', () => {
    const { container } = renderWithTheme(
      <CornerLeftDownIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
