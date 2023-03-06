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
      // @ts-expect-error testing failure case when there is no children passed
      renderWithTheme(<Amount value={'10000'} />);
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toEqual('[Blade: Amount]: Number as value is required for Amount.');
      }
    }
  });

  it('should render small size Amount', () => {
    const { toJSON } = renderWithTheme(<Amount size="small" value={1000} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render medium size Amount', () => {
    const { toJSON } = renderWithTheme(<Amount size="medium" value={1000} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render medium size Amount', () => {
    const { toJSON } = renderWithTheme(<Amount size="large" value={1000} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render medium size Amount', () => {
    const { toJSON } = renderWithTheme(<Amount size="xlarge" value={1000} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render medium size Amount', () => {
    const { toJSON } = renderWithTheme(<Amount size="2xlarge" value={1000} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render medium size Amount', () => {
    const { toJSON } = renderWithTheme(<Amount size="3xlarge" value={1000} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render amount with Decimal value', () => {
    const { toJSON } = renderWithTheme(<Amount size="3xlarge" suffix="decimals" value={1000.22} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render amount with Humanize value', () => {
    const { toJSON } = renderWithTheme(<Amount size="3xlarge" suffix="humanize" value={1000.22} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render positive variant Amount ', () => {
    const { toJSON } = renderWithTheme(<Amount variant="positive" value={1000} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render information variant Amount ', () => {
    const { toJSON } = renderWithTheme(<Amount variant="information" value={1000} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render negative variant Amount ', () => {
    const { toJSON } = renderWithTheme(<Amount variant="negative" value={1000} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render neutral variant Amount ', () => {
    const { toJSON } = renderWithTheme(<Amount variant="neutral" value={1000} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render positive variant Amount ', () => {
    const { toJSON } = renderWithTheme(<Amount variant="notice" value={1000} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render positive variant Amount with bold and isAffixSubtle false', () => {
    const { toJSON } = renderWithTheme(
      <Amount isAffixSubtle={false} weight="bold" variant="positive" value={1000} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render information variant Amount ', () => {
    const { toJSON } = renderWithTheme(
      <Amount isAffixSubtle={false} weight="bold" variant="information" value={1000} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render negative variant Amount ', () => {
    const { toJSON } = renderWithTheme(
      <Amount isAffixSubtle={false} weight="bold" variant="negative" value={1000} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render neutral variant Amount ', () => {
    const { toJSON } = renderWithTheme(
      <Amount isAffixSubtle={false} weight="bold" variant="neutral" value={1000} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render positive variant Amount ', () => {
    const { toJSON } = renderWithTheme(
      <Amount isAffixSubtle={false} weight="bold" variant="notice" value={1000} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render positive variant Amount with bold and isAffixSubtle false', () => {
    const { toJSON } = renderWithTheme(
      <Amount isAffixSubtle={false} weight="bold" variant="positive" value={1000} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render information variant Amount ', () => {
    const { toJSON } = renderWithTheme(
      <Amount isAffixSubtle={false} weight="bold" variant="information" value={1000} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render negative variant Amount ', () => {
    const { toJSON } = renderWithTheme(
      <Amount isAffixSubtle={false} weight="bold" variant="negative" value={1000} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render neutral variant Amount ', () => {
    const { toJSON } = renderWithTheme(
      <Amount isAffixSubtle={false} weight="bold" variant="neutral" value={1000} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render positive variant Amount ', () => {
    const { toJSON } = renderWithTheme(
      <Amount isAffixSubtle={false} weight="bold" variant="notice" value={1000} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
