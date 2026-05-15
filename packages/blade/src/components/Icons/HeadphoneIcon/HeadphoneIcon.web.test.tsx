import renderWithTheme from '~utils/testing/renderWithTheme.web';

import HeadphoneIcon from './';

describe('<HeadphoneIcon />', () => {
  it('should render HeadphoneIcon', () => {
    const { container } = renderWithTheme(
      <HeadphoneIcon color="feedback.icon.neutral.intense" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});
