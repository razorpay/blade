import renderWithTheme from '~utils/testing/renderWithTheme.web';

import EngageFilledIcon from './';

describe('<EngageFilledIcon />', () => {
  it('should render EngageFilledIcon', () => {
    const { container } = renderWithTheme(
      <EngageFilledIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
