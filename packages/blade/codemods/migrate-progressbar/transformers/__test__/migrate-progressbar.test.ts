import { applyTransform } from '@hypermod/utils';
import * as transformer from '..';

it('should migrate the ProgressBar component', async () => {
  const result = await applyTransform(
    transformer,
    `
    const App = () => (
        <>
          <ProgressBar variant="meter" />
          <ProgressBar variant="progress" />
        </>
      );
    `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "const App = () => (
            <>
              <ProgressBar type="meter" />
              <ProgressBar type="progress" />
            </>
          );"
  `);
});
