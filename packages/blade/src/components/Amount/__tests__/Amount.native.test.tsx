import { Amount } from '../Amount';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<Amount />', () => {
  it('should render Amount with default props', () => {
    const { toJSON } = renderWithTheme(<Amount value={1000} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should throw an error when a string is passed', () => {
    // @ts-expect-error testing failure case when value is passed as a string
    expect(() => renderWithTheme(<Amount value={'10000'} />)).toThrow(
      '[Blade: Amount]: `value` prop must be of type `number` for Amount.',
    );
  });

  it('should accept testID', () => {
    const { getByTestId } = renderWithTheme(<Amount value={10000} testID="amount-test" />);
    expect(getByTestId('amount-test')).toBeTruthy();
  });

  it('should render all sizes of Amount', () => {
    const { toJSON } = renderWithTheme(
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

  it('should render MYR currency Amount ', () => {
    const { toJSON } = renderWithTheme(<Amount currency="MYR" value={1000} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
