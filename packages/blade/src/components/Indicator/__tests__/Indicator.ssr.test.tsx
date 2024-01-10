import { Indicator } from '..';
import renderWithSSR from '~utils/testing/renderWithSSR.web';

describe('<Indicator />', () => {
  it('should have role and a11y label when text label is passed', () => {
    const label = 'Active';
    const { getByRole, getByLabelText, container } = renderWithSSR(<Indicator>{label}</Indicator>);

    getByRole('status');
    getByLabelText(label);

    expect(container).toMatchSnapshot();
  });
});
