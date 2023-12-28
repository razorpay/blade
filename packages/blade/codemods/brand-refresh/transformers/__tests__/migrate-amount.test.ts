import { applyTransform } from '@hypermod/utils';
import * as transformer from '..';

it('should update token values contextually', async () => {
  const result = await applyTransform(
    transformer,
    `
    const App = () => (
        <>
          <Amount value={1234} color="positive" />

          <Amount size="body-small" value={123456.789} />

          <Amount size="body-small-bold" value={123456.789} />
          
          <Amount size="body-medium" value={123456.789} />
    
          <Amount size="body-medium-bold" value={123456.789} />
           
          <Amount size="heading-small" value={123456.789} />
    
          <Amount size="heading-small-bold" value={123456.789} />
          
          <Amount size="heading-large" value={123456.789} />

          <Amount size="heading-large-bold" value={123456.789} />  
 
          <Amount size="title-small" value={123456.789} />

          <Amount size="title-medium" value={123456.789} />
        </>
      );
    `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "const App = () => (
            <>
              <Amount value={1234} color="positive" />

              <Amount value={123456.789} type="body" size="small" />

              <Amount value={123456.789} type="body" size="small" weight="semibold" />
              
              <Amount value={123456.789} type="body" size="medium" />
        
              <Amount value={123456.789} type="body" size="medium" weight="semibold" />
               
              <Amount value={123456.789} type="body" size="large" />
        
              <Amount value={123456.789} type="body" size="large" weight="semibold" />
              
              <Amount value={123456.789} type="heading" size="medium" />

              <Amount value={123456.789} type="heading" size="medium" weight="semibold" />  
     
              <Amount value={123456.789} type="heading" size="large" />

              <Amount value={123456.789} type="heading" size="xlarge" />
            </>
          );"
  `);
});
