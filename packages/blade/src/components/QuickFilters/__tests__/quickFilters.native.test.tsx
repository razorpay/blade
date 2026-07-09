import { fireEvent } from '@testing-library/react-native';
import { QuickFilter } from '../QuickFilter';
import { QuickFilterGroup } from '../QuickFilterGroup/QuickFilterGroup';
import renderWithTheme from '~utils/testing/renderWithTheme.native';
import { Counter } from '~components/Counter';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<QuickFilters />', () => {
  it('should render values correctly', () => {
    const { toJSON } = renderWithTheme(
      <QuickFilterGroup selectionType="single">
        <QuickFilter title="Title1" value="value1" trailing={<Counter value={234} />} />
        <QuickFilter title="Title2" value="value2" trailing={<Counter value={234} />} />
      </QuickFilterGroup>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should fire onChange correctly for single selection', () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <QuickFilterGroup selectionType="single" onChange={onChange}>
        <QuickFilter title="Title1" value="value1" trailing={<Counter value={234} />} />
        <QuickFilter title="Title2" value="value2" trailing={<Counter value={234} />} />
      </QuickFilterGroup>,
    );
    fireEvent.press(getByRole('button', { name: 'Title1' }));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        name: expect.stringMatching(/^quick-filter-group-\d+$/),
        values: expect.arrayContaining(['value1']),
      }),
    );
  });

  it('should fire onChange correctly for multiple selection', () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <QuickFilterGroup selectionType="multiple" onChange={onChange}>
        <QuickFilter title="Title1" value="value1" trailing={<Counter value={234} />} />
        <QuickFilter title="Title2" value="value2" trailing={<Counter value={234} />} />
      </QuickFilterGroup>,
    );
    fireEvent.press(getByRole('button', { name: 'Title1' }));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        name: expect.stringMatching(/^quick-filter-group-\d+$/),
        values: expect.arrayContaining(['value1']),
      }),
    );
    fireEvent.press(getByRole('button', { name: 'Title2' }));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        name: expect.stringMatching(/^quick-filter-group-\d+$/),
        values: expect.arrayContaining(['value1', 'value2']),
      }),
    );
  });

  it('should not fire onChange if the same radio is pressed again', () => {
    const onChange = jest.fn();
    const { getByRole } = renderWithTheme(
      <QuickFilterGroup selectionType="single" onChange={onChange}>
        <QuickFilter title="Title1" value="value1" trailing={<Counter value={234} />} />
        <QuickFilter title="Title2" value="value2" trailing={<Counter value={234} />} />
      </QuickFilterGroup>,
    );
    fireEvent.press(getByRole('button', { name: 'Title1' }));
    fireEvent.press(getByRole('button', { name: 'Title1' }));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should render correctly with multiple selectionType', () => {
    const { toJSON } = renderWithTheme(
      <QuickFilterGroup selectionType="multiple">
        <QuickFilter title="Option A" value="a" />
        <QuickFilter title="Option B" value="b" />
      </QuickFilterGroup>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('should reflect controlled value via accessibilityState', () => {
    const { getByRole } = renderWithTheme(
      <QuickFilterGroup selectionType="single" value="value2">
        <QuickFilter title="Title1" value="value1" />
        <QuickFilter title="Title2" value="value2" />
      </QuickFilterGroup>,
    );
    expect(getByRole('button', { name: 'Title2' }).props.accessibilityState?.selected).toBe(true);
    expect(getByRole('button', { name: 'Title1' }).props.accessibilityState?.selected).toBe(
      false,
    );
  });
});
