import { applyTransform } from '@hypermod/utils';
import * as transformer from '../migrate-typography';

it('should update the lineHeight & fontSize tokens', async () => {
  const result = await applyTransform(
    transformer,
    `
        const CustomHeading = styled(Heading)\`
            font-size: \${theme.typography.fonts.size['1600']};
            line-height: \${theme.typography.lineHeights['1500']};
        \`  
        const App = () => (
            <>
              <CustomHeading> Lorem ipsum </CustomHeading>  
            </>
          );
        `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "const CustomHeading = styled(Heading)\`
                font-size: \${theme.typography.fonts.size[1100]};
                line-height: \${theme.typography.lineHeights[1100]};
            \`  
            const App = () => (
                <>
                  <CustomHeading> Lorem ipsum </CustomHeading>  
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

it('should remove the "type" prop and change weight="bold" to weight="semibold"', async () => {
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

it('should remove the "type" & "variant" prop with nested components', async () => {
  const result = await applyTransform(
    transformer,
    `
    const App = () => (
      <>
        <Display type="normal" size="large" marginTop="120px">
            Lorem ipsum
            <Display type="normal" as="span"size="large" color="brand.secondary.500">
                Lorem ipsum
            </Display>
        </Display>
        <Heading type="normal" variant="regular" size="large" marginTop="120px">
            Lorem ipsum
            <Heading type="normal" variant="subheading" as="span"size="large" color="brand.secondary.500">
                Lorem ipsum
            </Heading>
        </Heading>
      </>
    );
    `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "const App = () => (
          <>
            <Display size="large" marginTop="120px">
                Lorem ipsum
                <Display as="span" size="large" color="brand.secondary.500">
                    Lorem ipsum
                </Display>
            </Display>
            <Heading size="large" marginTop="120px">
                Lorem ipsum
                <Heading as="span" size="large" color="brand.secondary.500">
                    Lorem ipsum
                </Heading>
            </Heading>
          </>
        );"
  `);
});

it('should correctly convert Title to Heading component', async () => {
  const result = await applyTransform(
    transformer,
    `
    import { Title, Heading } from '@razorpay/blade/components';
    const App = () => (
      <>
        <Title type="body" weight="bold" size="xlarge" > Lorem ipsum </Title>
        <Title type="body" weight="bold" size="large" > Lorem ipsum </Title>
        <Title type="body" weight="bold" size="medium" > Lorem ipsum </Title>
        <Title type="body" weight="bold" size="small" > Lorem ipsum </Title>
        // Conditional expression props should not be changed
        <Title type="body" weight="bold" size={isMobile ? 'medium' : 'large'} > Lorem ipsum </Title>
      </>
    );
    `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "import { Heading } from '@razorpay/blade/components';
        const App = () => (
          <>
            <Heading weight="semibold" size="2xlarge"> Lorem ipsum </Heading>
            <Heading weight="semibold" size="xlarge"> Lorem ipsum </Heading>
            <Heading weight="semibold" size="xlarge"> Lorem ipsum </Heading>
            <Heading weight="semibold" size="large"> Lorem ipsum </Heading>
            // Conditional expression props should not be changed
            <Heading weight="semibold" size={isMobile ? 'medium' : 'large'}> Lorem ipsum </Heading>
          </>
        );"
  `);
});
