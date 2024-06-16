import { applyTransform } from '@hypermod/utils';
import * as transformer from '..';

it('should migrate the ProgressBar component', async () => {
  const result = await applyTransform(
    transformer,
    `
    const App = () => (
        <>
          <ProgressBar value={20} label="Label" />
          <ProgressBar variant="meter" value={20} label="Label" />
          <ProgressBar variant="progress" value={20} label="Label" />
        </>
      );
    `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "const App = () => (
            <>
              <ProgressBar value={20} label="Label" type="progress" />
              <ProgressBar type="meter" value={20} label="Label" />
              <ProgressBar type="progress" value={20} label="Label" />
            </>
          );"
  `);
});
