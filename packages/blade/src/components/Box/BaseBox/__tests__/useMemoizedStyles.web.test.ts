import { getDependencyProps } from '../useMemoizedStyles';

describe('getDependencyProp', () => {
  it('should return react usememo dependency prop', () => {
    expect(
      getDependencyProps({
        paddingLeft: '12px',
        display: 'block',
        id: 'yo',
        className: 'hi',
        children: 'wuuhuuu',
        // @ts-expect-error: we don't have to care about actual theme object. It is ignored in this function
        theme: { something: 'something' },
      }),
    ).toMatchInlineSnapshot(`"{\\"paddingLeft\\":\\"12px\\",\\"display\\":\\"block\\"}"`);
  });
});
