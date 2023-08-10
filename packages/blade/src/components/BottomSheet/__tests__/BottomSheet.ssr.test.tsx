/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { BottomSheet, BottomSheetBody, BottomSheetFooter, BottomSheetHeader } from '../BottomSheet';
import renderWithSSR from '~utils/testing/renderWithSSR.web';
import { Text } from '~components/Typography';
import { Badge } from '~components/Badge';
import { Counter } from '~components/Counter';
import { Button } from '~components/Button';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

describe('<BottomSheet />', () => {
  // Skipping this test as it is fails in SSR with error: ReferenceError: navigator is not defined
  // coming from @floating-ui/react, which is used in BottomSheet component
  // https://github.com/floating-ui/floating-ui/blob/94ba5b7c7069c272c967e4eef6ba09a793880855/packages/utils/react/src/index.ts#L109
  it.skip('should render a BottomSheet ssr', () => {
    const { container } = renderWithSSR(
      <BottomSheet isOpen={true}>
        <BottomSheetHeader
          title="Address Details"
          subtitle="Saving addresses will improve your checkout experience"
          trailing={<Badge variant="positive">Action Needed</Badge>}
          titleSuffix={<Counter variant="positive" value={2} />}
        />
        <BottomSheetBody>
          <Text>BottomSheet body</Text>
        </BottomSheetBody>
        <BottomSheetFooter>
          <Button isFullWidth variant="secondary">
            Remove address
          </Button>
        </BottomSheetFooter>
      </BottomSheet>,
    );

    expect(container).toMatchSnapshot();
  });
});
