import { applyTransform } from '@hypermod/utils';
import * as transformer from '..';

it('should migrate the Badge component', async () => {
  const result = await applyTransform(
    transformer,
    `
    const App = () => (
        <>
            <Badge fontWeight="bold"> Hello </Badge>
            <Badge variant="blue"> Hello </Badge>
            <Badge color="default"> Hello </Badge>
            <Badge variant="blue" color="default"> Hello </Badge>
            <Badge variant="negative" color="positive"> Hello </Badge>
        </>
      );
    `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "const App = () => (
            <>
                <Badge> Hello </Badge>
                <Badge color="primary"> Hello </Badge>
                <Badge color="primary"> Hello </Badge>
                <Badge color="primary"> Hello </Badge>
                <Badge color="positive"> Hello </Badge>
            </>
          );"
  `);
});
