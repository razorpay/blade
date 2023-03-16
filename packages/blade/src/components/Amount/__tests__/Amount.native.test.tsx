import { Amount } from '../Amount';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<Amount />', () => {
  it('should render Amount with default props', () => {
    const { toJSON } = renderWithTheme(<Amount value={1000} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should throw an error when a string is passed', () => {
    try {
      // @ts-expect-error testing failure case when value is passed as a string
      renderWithTheme(<Amount value={'10000'} />);
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toEqual('[Blade: Amount]: Number as value is required for Amount.');
      }
    }
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(<Amount value={10000} testID="amount-test" />);
    expect(getByTestId('amount-test')).toBeTruthy();
  });

  it('should render body-medium size Amount', () => {
    const { toJSON } = renderWithTheme(<Amount size="body-medium" value={1000} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render body-medium-bold size Amount', () => {
    const { toJSON } = renderWithTheme(<Amount size="body-medium-bold" value={1000} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render body-small size Amount', () => {
    const { toJSON } = renderWithTheme(<Amount size="body-small" value={1000} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render body-small-bold size Amount', () => {
    const { toJSON } = renderWithTheme(<Amount size="body-small-bold" value={1000} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render heading-large size Amount', () => {
    const { toJSON } = renderWithTheme(<Amount size="heading-large" value={1000} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render heading-large-bold size Amount', () => {
    const { toJSON } = renderWithTheme(<Amount size="heading-large-bold" value={1000} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render heading-small size Amount', () => {
    const { toJSON } = renderWithTheme(<Amount size="heading-small" value={1000} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render heading-small-bold size Amount', () => {
    const { toJSON } = renderWithTheme(<Amount size="heading-small-bold" value={1000} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render title-medium size Amount', () => {
    const { toJSON } = renderWithTheme(<Amount size="title-medium" value={1000} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render title-small size Amount', () => {
    const { toJSON } = renderWithTheme(<Amount size="title-small" value={1000} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render amount with Decimal value', () => {
    const { toJSON } = renderWithTheme(
      <Amount size="heading-small" suffix="decimals" value={1000.22} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render amount with Humanize value', () => {
    const { toJSON } = renderWithTheme(
      <Amount size="heading-small" suffix="humanize" value={1000.22} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render positive intent Amount ', () => {
    const { toJSON } = renderWithTheme(<Amount intent="positive" value={1000} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render information intent Amount ', () => {
    const { toJSON } = renderWithTheme(
      <Amount isAffixSubtle={false} intent="information" value={1000} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
