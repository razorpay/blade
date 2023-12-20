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

        <Badge variant="blue"> Hello </Badge>
        <Badge color="default"> Hello </Badge>
        <Badge variant="blue" color="default"> Hello </Badge>
        <Badge variant="negative" color="positive"> Hello </Badge>

        <Counter variant="blue"> Hello </Counter>
        <Counter intent="positive"> Hello </Counter>
        <Counter color="default"> Hello </Counter>
        <Counter variant="blue" intent="positive" color="default"> Hello </Counter>
        <Counter variant="negative" intent="notice" color="positive"> Hello </Counter>

        <Indicator intent="positive" />

        <Button variant="secondary" color="default"> Click Me </Button>
      </>
    );
    `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "const App = () => (
          <>
            <Alert description="Hello World" color="information" />

            <Badge color="primary"> Hello </Badge>
            <Badge color="default"> Hello </Badge>
            <Badge color="default"> Hello </Badge>
            <Badge color="positive"> Hello </Badge>

            <Counter color="primary"> Hello </Counter>
            <Counter color="positive"> Hello </Counter>
            <Counter color="default"> Hello </Counter>
            <Counter color="default"> Hello </Counter>
            <Counter color="positive"> Hello </Counter>

            <Indicator intent="positive" />

            <Button variant="secondary" color="default"> Click Me </Button>
          </>
        );"
  `);
});
