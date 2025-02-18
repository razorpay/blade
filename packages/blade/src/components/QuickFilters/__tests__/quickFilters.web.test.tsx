import { QuickFilterGroup, QuickFilter } from '../index';
import renderWithTheme from '~utils/testing/renderWithTheme.web';
import { Counter } from '~components/Counter';

describe('<QuickFilters/>', () => {
  it('should render Values Correctly', () => {
    const { container } = renderWithTheme(
      <QuickFilterGroup selectionType="single">
        <QuickFilter title="Title1" value="value1" trailingElement={<Counter value={234} />} />
        <QuickFilter title="Title2" value="value2" trailingElement={<Counter value={234} />} />
      </QuickFilterGroup>,
    );
    expect(container).toMatchSnapshot();
  });
  it('should fire onChange correctly for single selection', () => {
    const onChange = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <QuickFilterGroup selectionType="single" onChange={onChange}>
        <QuickFilter title="Title1" value="value1" trailingElement={<Counter value={234} />} />
        <QuickFilter title="Title2" value="value2" trailingElement={<Counter value={234} />} />
      </QuickFilterGroup>,
    );
    getByLabelText('Title1').click();
    expect(onChange).toHaveBeenCalledWith({ value: 'value1' });
  });
  it('should fire onChange correctly for multiple selection', () => {
    const onChange = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <QuickFilterGroup selectionType="multiple" onChange={onChange}>
        <QuickFilter title="Title1" value="value1" trailingElement={<Counter value={234} />} />
        <QuickFilter title="Title2" value="value2" trailingElement={<Counter value={234} />} />
      </QuickFilterGroup>,
    );
    getByLabelText('Title1').click();
    expect(onChange).toHaveBeenCalledWith({ values: ['value1'] });
  });
  it('should not fire onChange if the same value is clicked again', () => {
    const onChange = jest.fn();
    const { getByLabelText } = renderWithTheme(
      <QuickFilterGroup selectionType="single" onChange={onChange}>
        <QuickFilter title="Title1" value="value1" trailingElement={<Counter value={234} />} />
        <QuickFilter title="Title2" value="value2" trailingElement={<Counter value={234} />} />
      </QuickFilterGroup>,
    );
    getByLabelText('Title1').click();
    getByLabelText('Title1').click();
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
