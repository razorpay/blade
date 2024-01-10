/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { render } from '@testing-library/react';
import { assignWithoutSideEffects } from '../assignWithoutSideEffects';
import { useVerifyAllowedChildren } from './useVerifyAllowedChildren';

beforeAll(() => jest.spyOn(console, 'error').mockImplementation());
afterAll(() => jest.restoreAllMocks());

const componentIds = {
  AllowedChildOne: 'AllowedChildOne',
  AllowedChildTwo: 'AllowedChildTwo',
  disallowedChild: 'disallowedChild',
};
const _AllowedChildOne = () => <></>;
const AllowedChildOne = assignWithoutSideEffects(_AllowedChildOne, {
  componentId: componentIds.AllowedChildOne,
});
const _AllowedChildTwo = () => <></>;
const AllowedChildTwo = assignWithoutSideEffects(_AllowedChildTwo, {
  componentId: componentIds.AllowedChildTwo,
});

const Example = ({ children }: { children: React.ReactNode }) => {
  useVerifyAllowedChildren({
    children,
    componentName: 'Example',
    allowedComponents: [componentIds.AllowedChildOne, componentIds.AllowedChildTwo],
  });

  return <></>;
};

describe('useVerifyAllowedChildren', () => {
  it('should throw error if disallowed component is passed to children', () => {
    expect(() =>
      render(
        <Example>
          <p>hello world</p>
        </Example>,
      ),
    ).toThrow(
      '[Blade: Example]: Only `AllowedChildOne, AllowedChildTwo` components are accepted in `Example` children',
    );
  });

  it('should not throw error if allowed component is passed', () => {
    expect(() =>
      render(
        <Example>
          <AllowedChildOne />
          <AllowedChildTwo />
        </Example>,
      ),
    ).not.toThrow();
  });
});
