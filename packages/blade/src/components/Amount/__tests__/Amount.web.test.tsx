import { Amount } from '../Amount';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

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
    try {
      // @ts-expect-error testing failure case when there is no children passed
      renderWithTheme(<Amount value={'10000'} />);
    } catch (error: unknown) {
      if (error instanceof Error) {
        expect(error.message).toEqual('[Blade: Amount]: Number as value is required for Amount.');
      }
    }
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
    const { container } = renderWithTheme(<Amount size="body-medium-bold" value={1000} />);
    expect(container).toMatchSnapshot();
  });

  it('should render heading-large size Amount', () => {
    const { container } = renderWithTheme(<Amount size="heading-large" value={1000} />);
    expect(container).toMatchSnapshot();
  });

  it('should render heading-large-bold size Amount', () => {
    const { container } = renderWithTheme(<Amount size="heading-large-bold" value={1000} />);
    expect(container).toMatchSnapshot();
  });

  it('should render heading-small size Amount', () => {
    const { container } = renderWithTheme(<Amount size="heading-small" value={1000} />);
    expect(container).toMatchSnapshot();
  });

  it('should render heading-small-bold size Amount', () => {
    const { container } = renderWithTheme(<Amount size="heading-small-bold" value={1000} />);
    expect(container).toMatchSnapshot();
  });

  it('should render title-medium size Amount', () => {
    const { container } = renderWithTheme(<Amount size="title-medium" value={1000} />);
    expect(container).toMatchSnapshot();
  });

  it('should render title-small size Amount', () => {
    const { container } = renderWithTheme(<Amount size="title-small" value={1000} />);
    expect(container).toMatchSnapshot();
  });

  it('should render amount with Humanize value', () => {
    const { container } = renderWithTheme(
      <Amount size="title-medium" suffix="humanize" value={1000.22} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render positive variant Amount ', () => {
    const { container } = renderWithTheme(<Amount intent="positive" value={1000} />);
    expect(container).toMatchSnapshot();
  });

  it('should render information variant Amount ', () => {
    const { container } = renderWithTheme(<Amount intent="information" value={1000} />);
    expect(container).toMatchSnapshot();
  });

  it('should render negative variant Amount ', () => {
    const { container } = renderWithTheme(<Amount intent="negative" value={1000} />);
    expect(container).toMatchSnapshot();
  });

  it('should render neutral variant Amount ', () => {
    const { container } = renderWithTheme(<Amount intent="neutral" value={1000} />);
    expect(container).toMatchSnapshot();
  });

  it('should render positive variant Amount ', () => {
    const { container } = renderWithTheme(<Amount intent="notice" value={1000} />);
    expect(container).toMatchSnapshot();
  });

  it('should render positive variant Amount with bold and isAffixSubtle false', () => {
    const { container } = renderWithTheme(
      <Amount isAffixSubtle={false} intent="positive" value={1000} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render information variant Amount ', () => {
    const { container } = renderWithTheme(
      <Amount isAffixSubtle={false} intent="information" value={1000} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render negative variant Amount ', () => {
    const { container } = renderWithTheme(
      <Amount isAffixSubtle={false} intent="negative" value={1000} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render neutral variant Amount ', () => {
    const { container } = renderWithTheme(
      <Amount isAffixSubtle={false} intent="neutral" value={1000} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('should render positive variant Amount ', () => {
    const { container } = renderWithTheme(
      <Amount isAffixSubtle={false} intent="notice" value={1000} />,
    );
    expect(container).toMatchSnapshot();
  });
});
