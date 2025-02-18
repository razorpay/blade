import { QuickFilterGroup, QuickFilter } from '../index';
import renderWithSSR from '~utils/testing/renderWithSSR.web';
import { Counter } from '~components/Counter';

describe('<QuickFilters/>', () => {
  it('should render Values Correctly', () => {
    const { container } = renderWithSSR(
      <QuickFilterGroup selectionType="single">
        <QuickFilter title="Title1" value="value1" trailingElement={<Counter value={234} />} />
        <QuickFilter title="Title2" value="value2" trailingElement={<Counter value={234} />} />
      </QuickFilterGroup>,
    );
    expect(container).toMatchSnapshot();
  });
});
