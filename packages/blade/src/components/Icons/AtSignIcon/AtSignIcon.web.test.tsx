import renderWithTheme from '~utils/testing/renderWithTheme.web';

import AtSignIcon from './';

describe('<AtSignIcon />', () => {
  it('should render AtSignIcon', () => {
    const { container } = renderWithTheme(
      <AtSignIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
