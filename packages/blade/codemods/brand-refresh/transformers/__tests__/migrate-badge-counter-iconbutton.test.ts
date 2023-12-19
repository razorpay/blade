import { applyTransform } from '@hypermod/utils';
import * as transformer from '..';

it('should migrate contrast prop to emphasis', async () => {
  const result = await applyTransform(
    transformer,
    `
    const App = () => (
        <>
        <Badge variant="neutral" contrast="low">Hello</Badge> 
        <Badge variant="neutral" contrast="high">Hello</Badge> 

        <Counter variant="neutral" contrast="low">Hello</Counter> 
        <Counter variant="neutral" contrast="high">Hello</Counter>

        <IconButton icon={CloseIcon} contrast="low" onClick={() => console.log('Clicked')} />
        <IconButton icon={CloseIcon} contrast="high" onClick={() => console.log('Clicked')} />
        
        </>
      );
    `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "const App = () => (
            <>
            <Badge variant="neutral" emphesis="subtle">Hello</Badge> 
            <Badge variant="neutral" emphesis="intense">Hello</Badge> 

            <Counter variant="neutral" emphesis="subtle">Hello</Counter> 
            <Counter variant="neutral" emphesis="intense">Hello</Counter>

            <IconButton icon={CloseIcon} emphesis="intense" onClick={() => console.log('Clicked')} />
            <IconButton icon={CloseIcon} emphesis="subtle" onClick={() => console.log('Clicked')} />
            
            </>
          );"
  `);
});
