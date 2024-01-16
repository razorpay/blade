import { applyTransform } from '@hypermod/utils';
import * as transformer from '..';

it('should migrate the Divider component', async () => {
  const result = await applyTransform(
    transformer,
    `
    const App = () => (
        <>
          <Divider variant="normal" />
        </>
      );
    `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "const App = () => (
            <>
              <Divider variant="muted" />
            </>
          );"
  `);
});
