import { Amount } from '../Amount';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';
import assertAccessible from '~src/_helpers/testing/assertAccessible.web';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Amount />', () => {
  it('should render Amount with default props', () => {
    const { container } = renderWithTheme(<Amount value={1000} />);
    expect(container).toMatchSnapshot();
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(<Amount value={1000} testID="amount-test" />);

    expect(getByTestId('amount-test')).toBeTruthy();
  });

  it('should throw an error when a string is passed', () => {
    // @ts-expect-error testing failure case when value is passed as a string
    expect(() => renderWithTheme(<Amount value={'10000'} />)).toThrow(
      '[Blade: Amount]: `value` prop must be of type `number` for Amount.',
    );
  });

  it('should render body-small size Amount', () => {
    const { container } = renderWithTheme(<Amount size="body-small" value={1000} />);
    expect(container).toMatchSnapshot();
  });

  it('should render body-small-bold size Amount', () => {
    const { container } = renderWithTheme(<Amount size="body-small-bold" value={1000} />);
    expect(container).toMatchSnapshot();
  });

  it('should render body-medium size Amount', () => {
    const { container } = renderWithTheme(<Amount size="body-medium" value={1000} />);
    expect(container).toMatchSnapshot();
  });

  it('should render body-medium-bold size Amount', () => {
    const { container } = renderWithTheme(
      <>
        <Amount size="body-medium" value={1000} />
        <Amount size="body-medium-bold" value={1000} />
        <Amount size="body-small" value={1000} />
        <Amount size="body-small-bold" value={1000} />
        <Amount size="heading-large" value={1000} />
        <Amount size="heading-large-bold" value={1000} />
        <Amount size="heading-small" value={1000} />
        <Amount size="heading-small-bold" value={1000} />
        <Amount size="title-medium" value={1000} />
      </>,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render amount with Humanize value', () => {
    const { container } = renderWithTheme(
      <Amount size="title-medium" suffix="humanize" value={1000.22} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render positive intent Amount ', () => {
    const { container } = renderWithTheme(<Amount intent="positive" value={1000} />);
    expect(container).toMatchSnapshot();
  });

  it('should render negative intent Amount ', () => {
    const { container } = renderWithTheme(
      <Amount isAffixSubtle={false} intent="negative" value={1000} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render MYR currency Amount ', () => {
    const { container } = renderWithTheme(<Amount currency="MYR" value={1000} />);
    expect(container).toMatchSnapshot();
  });

  it('should not have accessibility violations', async () => {
    const { container } = renderWithTheme(<Amount value={1000} />);
    await assertAccessible(container);
  });
});
