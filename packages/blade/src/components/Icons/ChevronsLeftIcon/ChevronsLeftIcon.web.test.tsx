import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ChevronsLeftIcon from './';

describe('<ChevronsLeftIcon />', () => {
  it('should render ChevronsLeftIcon', () => {
    const { container } = renderWithTheme(
      <ChevronsLeftIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
