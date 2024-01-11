import { applyTransform } from '@hypermod/utils';
import * as transformer from '..';

it('should update token values contextually', async () => {
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
