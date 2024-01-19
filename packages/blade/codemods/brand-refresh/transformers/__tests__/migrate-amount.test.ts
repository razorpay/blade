import { applyTransform } from '@hypermod/utils';
import * as transformer from '..';

it('should migrate the Amount component', async () => {
  const result = await applyTransform(
    transformer,
    `
    const App = () => (
        <>
          <Amount value={1234} intent="positive" />

          <Amount value={1234} intent="negative" />

          <Amount value={1234} intent="information" />

          <Amount value={1234} intent="notice" />

          <Amount size="body-small" value={123456.789} />

          <Amount size="body-small-bold" value={123456.789} />
          
          <Amount size="body-medium" value={123456.789} />
    
          <Amount size="body-medium-bold" value={123456.789} />
           
          <Amount size="heading-small" value={123456.789} />
    
          <Amount size="heading-small-bold" value={123456.789} />
          
          <Amount size="heading-large" value={123456.789} />

          <Amount size="heading-large-bold" value={123456.789} />  
 
          <Amount size="title-small" value={123456.789} />

          <CardHeaderAmount value={1234} intent="positive" />

          <CardHeaderAmount value={1234} intent="negative" />

          <CardHeaderAmount value={1234} intent="information" />

          <CardHeaderAmount value={1234} intent="notice" />

          <CardHeaderAmount size="title-medium" value={123456.789} />

          <CardHeaderAmount size="body-small" value={123456.789} />

          <CardHeaderAmount size="body-small-bold" value={123456.789} />
          
          <CardHeaderAmount size="body-medium" value={123456.789} />
    
          <CardHeaderAmount size="body-medium-bold" value={123456.789} />
           
          <CardHeaderAmount size="heading-small" value={123456.789} />
    
          <CardHeaderAmount size="heading-small-bold" value={123456.789} />
          
          <CardHeaderAmount size="heading-large" value={123456.789} />

          <CardHeaderAmount size="heading-large-bold" value={123456.789} />  
 
          <CardHeaderAmount size="title-small" value={123456.789} />

          <CardHeaderAmount size="title-medium" value={123456.789} />
        </>
      );
    `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "const App = () => (
            <>
              <Amount value={1234} color="feedback.text.positive.intense" />

              <Amount value={1234} color="feedback.text.negative.intense" />

              <Amount value={1234} color="feedback.text.information.intense" />

              <Amount value={1234} color="feedback.text.notice.intense" />

              <Amount value={123456.789} type="body" size="small" />

              <Amount value={123456.789} type="body" size="small" weight="semibold" />
              
              <Amount value={123456.789} type="body" size="medium" />
        
              <Amount value={123456.789} type="body" size="medium" weight="semibold" />
               
              <Amount value={123456.789} type="body" size="large" />
        
              <Amount value={123456.789} type="body" size="large" weight="semibold" />
              
              <Amount value={123456.789} type="heading" size="medium" />

              <Amount value={123456.789} type="heading" size="medium" weight="semibold" />  
     
              <Amount value={123456.789} type="heading" size="large" />

              <CardHeaderAmount value={1234} color="feedback.text.positive.intense" />

              <CardHeaderAmount value={1234} color="feedback.text.negative.intense" />

              <CardHeaderAmount value={1234} color="feedback.text.information.intense" />

              <CardHeaderAmount value={1234} color="feedback.text.notice.intense" />

              <CardHeaderAmount value={123456.789} type="heading" size="xlarge" />

              <CardHeaderAmount value={123456.789} type="body" size="small" />

              <CardHeaderAmount value={123456.789} type="body" size="small" weight="semibold" />
              
              <CardHeaderAmount value={123456.789} type="body" size="medium" />
        
              <CardHeaderAmount value={123456.789} type="body" size="medium" weight="semibold" />
               
              <CardHeaderAmount value={123456.789} type="body" size="large" />
        
              <CardHeaderAmount value={123456.789} type="body" size="large" weight="semibold" />
              
              <CardHeaderAmount value={123456.789} type="heading" size="medium" />

              <CardHeaderAmount value={123456.789} type="heading" size="medium" weight="semibold" />  
     
              <CardHeaderAmount value={123456.789} type="heading" size="large" />

              <CardHeaderAmount value={123456.789} type="heading" size="xlarge" />
            </>
          );"
  `);
});
