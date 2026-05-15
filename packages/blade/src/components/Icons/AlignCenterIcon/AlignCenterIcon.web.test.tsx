import renderWithTheme from '~utils/testing/renderWithTheme.web';

import AlignCenterIcon from './';

describe('<AlignCenterIcon />', () => {
  it('should render AlignCenterIcon', () => {
    const { container } = renderWithTheme(
      <AlignCenterIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
