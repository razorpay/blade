import renderWithTheme from '~utils/testing/renderWithTheme.web';

import ChevronsUpIcon from './';

describe('<ChevronsUpIcon />', () => {
  it('should render ChevronsUpIcon', () => {
    const { container } = renderWithTheme(
      <ChevronsUpIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
