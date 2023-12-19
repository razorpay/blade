import { applyTransform } from '@hypermod/utils';
import * as transformer from '..';

it('should migrate contrast prop to emphasis', async () => {
  const result = await applyTransform(
    transformer,
    `
    const App = () => (
        <>
        <Badge contrast="low">Hello</Badge> 
        <Badge contrast="high">Hello</Badge> 

        <Counter contrast="low">Hello</Counter> 
        <Counter contrast="high">Hello</Counter>

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
            <Badge emphesis="subtle">Hello</Badge> 
            <Badge emphesis="intense">Hello</Badge> 

            <Counter emphesis="subtle">Hello</Counter> 
            <Counter emphesis="intense">Hello</Counter>

            <IconButton icon={CloseIcon} emphesis="intense" onClick={() => console.log('Clicked')} />
            <IconButton icon={CloseIcon} emphesis="subtle" onClick={() => console.log('Clicked')} />
            
            </>
          );"
  `);
});

it('should remove variant/intent prop in favor of color prop', async () => {
  const result = await applyTransform(
    transformer,
    `
    const App = () => (
      <>
        <Alert description="Hello World" intent="information" />

        <Badge variant="neutral" intent="positive">Hello</Badge> 
        <Badge variant="blue" contrast="low">Hello</Badge>
        <Badge variant="blue" contrast="low">Hello</Badge>

        <Counter variant="neutral" contrast="low">Hello</Counter> 
        <Counter variant="neutral" contrast="high">Hello</Counter>        
      </>
    );
    `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "const App = () => (
          <>
            <Alert description="Hello World" />

            <Badge>Hello</Badge> 
            <Badge emphesis="subtle">Hello</Badge>
            <Badge emphesis="subtle">Hello</Badge>

            <Counter emphesis="subtle">Hello</Counter> 
            <Counter emphesis="intense">Hello</Counter>        
          </>
        );"
  `);
});
