import { TextArea } from '../';
import renderWithSSR from '~src/_helpers/testing/renderWithSSR.web';

describe('<TextArea />', () => {
  it('should render TextArea on server and have autofocus on client', () => {
    const label = 'Enter name';
    // eslint-disable-next-line jsx-a11y/no-autofocus
    const { container, getByLabelText } = renderWithSSR(<TextArea label={label} autoFocus />);

    const input = getByLabelText(label);
    expect(input).toHaveAttribute('autofocus');
    expect(container).toMatchSnapshot();
  });
});
