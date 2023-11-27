import { applyTransform } from '@hypermod/utils';

import * as transformer from '../migrate-typography';

it('should remove the "type" prop and change weight="bold" to weight="semibold"', async () => {
  const result = await applyTransform(
    transformer,
    `
        const App = () => (
          <>
            <Heading type="subtle" weight="bold" variant="subheading" marginTop="spacing.2"> Lorem ipsum </Heading>  
          </>
        );
      `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "const App = () => (
              <>
                <Heading weight="semibold" marginTop="spacing.2"> Lorem ipsum </Heading>  
              </>
            );"
  `);
});

it('should remove the "variant" prop from Heading', async () => {
  const result = await applyTransform(
    transformer,
    `
          const App = () => (
            <>
                <Text type="subtle" weight="bold"> Lorem ipsum </Text>
                <Heading type="subtle" weight="bold"> Lorem ipsum </Heading>
                <Title type="subtle" weight="bold"> Lorem ipsum </Title>
                <Display type="subtle" weight="bold"> Lorem ipsum </Display>
                // weight="bold" should not be changed
                <Code weight="bold"> Lorem ipsum </Code>
            </>
          );
        `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "const App = () => (
                <>
                    <Text weight="semibold"> Lorem ipsum </Text>
                    <Heading weight="semibold"> Lorem ipsum </Heading>
                    <Heading weight="semibold"> Lorem ipsum </Heading>
                    <Display weight="semibold"> Lorem ipsum </Display>
                    // weight="bold" should not be changed
                    <Code weight="bold"> Lorem ipsum </Code>
                </>
              );"
  `);
});

it('should correctly covert Title to Heading component', async () => {
  const result = await applyTransform(
    transformer,
    `
      const App = () => (
        <>
            <Title type="body" weight="bold" size="xlarge" > Lorem ipsum </Title>
            <Title type="body" weight="bold" size="large" > Lorem ipsum </Title>
            <Title type="body" weight="bold" size="medium" > Lorem ipsum </Title>
            <Title type="body" weight="bold" size="small" > Lorem ipsum </Title>
            <Title type="body" weight="bold" size={isMobile ? 'medium' : 'large'} > Lorem ipsum </Title>
        </>
      );
    `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "const App = () => (
            <>
                <Heading weight="semibold" size="2xlarge"> Lorem ipsum </Heading>
                <Heading weight="semibold" size="xlarge"> Lorem ipsum </Heading>
                <Heading weight="semibold" size="xlarge"> Lorem ipsum </Heading>
                <Heading weight="semibold" size="large"> Lorem ipsum </Heading>
                <Heading weight="semibold" size={isMobile ? 'medium' : 'large'}> Lorem ipsum </Heading>
            </>
          );"
  `);
});
