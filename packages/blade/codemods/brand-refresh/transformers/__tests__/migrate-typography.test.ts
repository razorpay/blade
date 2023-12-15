import { applyTransform } from '@hypermod/utils';
import * as transformer from '..';

it('should update the lineHeight & fontSize tokens', async () => {
  const result = await applyTransform(
    transformer,
    `
        const CustomHeading = styled(Heading)\`
            font-size: \${theme.typography.fonts.size[1600]};
            line-height: \${theme.typography.lineHeights[1500]};
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
                <Text weight="semibold" marginTop="spacing.2" size="small" color="surface.text.gray.subtle"> Lorem ipsum </Text>  
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
                    <Text weight="semibold" color="surface.text.gray.subtle"> Lorem ipsum </Text>
                    <Text weight="semibold" size="large" color="surface.text.gray.subtle"> Lorem ipsum </Text>
                    <Heading weight="semibold" size="large" color="surface.text.gray.subtle"> Lorem ipsum </Heading>
                    <Display weight="semibold" color="surface.text.gray.subtle"> Lorem ipsum </Display>
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
            <Heading type="normal" variant="subheading" as="span" color="brand.secondary.500">
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
            <Display size="large" marginTop="120px" color="surface.text.gray.normal">
                Lorem ipsum
                <Display as="span" size="large" color="surface.text.onSea.onSubtle">
                    Lorem ipsum
                </Display>
            </Display>
            <Heading marginTop="120px" size="medium" color="surface.text.gray.normal">
                Lorem ipsum
                <Text as="span" color="surface.text.onSea.onSubtle" size="small">
                    Lorem ipsum
                </Text>
            </Heading>
          </>
        );"
  `);
});

it('should update <Heading size="large|medium"> to <Heading size="medium|small">', async () => {
  const result = await applyTransform(
    transformer,
    `
        const App = () => (
          <>
            <Heading size="large"> Lorem ipsum </Heading>
            <Heading size="medium"> Lorem ipsum </Heading>

            <Heading size="large"> Lorem ipsum <Heading size="large"> Lorem ipsum </Heading> </Heading>
            <Heading size="medium"> Lorem ipsum <Heading size="medium"> Lorem ipsum </Heading> </Heading>
          </>
        );
      `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "const App = () => (
              <>
                <Heading size="medium"> Lorem ipsum </Heading>
                <Heading size="small"> Lorem ipsum </Heading>

                <Heading size="medium"> Lorem ipsum <Heading size="medium"> Lorem ipsum </Heading> </Heading>
                <Heading size="small"> Lorem ipsum <Heading size="small"> Lorem ipsum </Heading> </Heading>
              </>
            );"
  `);
});

it('should update <Heading size="small"> to <Text size="large">', async () => {
  const result = await applyTransform(
    transformer,
    `
        const App = () => (
          <>
            <Heading size="small"> Lorem ipsum </Heading>

            <Heading size="small"> Lorem ipsum <Heading size="small"> Lorem ipsum </Heading> </Heading>
          </>
        );
      `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "const App = () => (
              <>
                <Text size="large"> Lorem ipsum </Text>

                <Text size="large"> Lorem ipsum <Text size="large"> Lorem ipsum </Text> </Text>
              </>
            );"
  `);
});

it('should update <Heading variant="subheading"> to <Text size="small">', async () => {
  const result = await applyTransform(
    transformer,
    `
        const App = () => (
          <>
            <Heading variant="regular"> Lorem ipsum </Heading> 
            <Heading variant="subheading"> Lorem ipsum </Heading>
            <Heading variant="subheading"> Lorem ipsum <Heading variant="subheading"> Lorem ipsum </Heading> </Heading>
          </>
        );
      `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "const App = () => (
              <>
                <Text size="large"> Lorem ipsum </Text> 
                <Text size="small"> Lorem ipsum </Text>
                <Text size="small"> Lorem ipsum <Text size="small"> Lorem ipsum </Text> </Text>
              </>
            );"
  `);
});

it('should update <Heading size="small"> to <Text size="large">', async () => {
  const result = await applyTransform(
    transformer,
    `
        const App = () => (
          <>
            <Heading size="small"> Lorem ipsum </Heading>

            <Heading size="small"> Lorem ipsum <Heading size="small"> Lorem ipsum </Heading> </Heading>
          </>
        );
      `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "const App = () => (
              <>
                <Text size="large"> Lorem ipsum </Text>

                <Text size="large"> Lorem ipsum <Text size="large"> Lorem ipsum </Text> </Text>
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
        <Title> Lorem ipsum </Title>  
        <Title type="subtle" weight="bold" size="xlarge" > Lorem ipsum </Title>
        <Title type="subtle" weight="bold" size="large" > Lorem ipsum </Title>
        <Title type="subtle" weight="bold" size="medium" > Lorem ipsum </Title>
        <Title type="subtle" weight="bold" size="small" > Lorem ipsum </Title>
        // Conditional expression props should not be changed
        <Title type="subtle" weight="bold" size={isMobile ? 'medium' : 'large'} > Lorem ipsum </Title>

        <Title type="subtle" weight="bold" size="xlarge" > Lorem ipsum <Title type="subtle" weight="bold" size="xlarge" > Lorem ipsum  </Title>  </Title>
        <Title type="subtle" weight="bold" size="large" > Lorem ipsum <Title type="subtle" weight="bold" size="large" > Lorem ipsum </Title> </Title>
        <Title type="subtle" weight="bold" size="medium" > Lorem ipsum <Title type="subtle" weight="bold" size="medium" > Lorem ipsum </Title> </Title>
        <Title type="subtle" weight="bold" size="small" > Lorem ipsum <Title type="subtle" weight="bold" size="small" > Lorem ipsum </Title> </Title>
        // Conditional expression props should not be changed
        <Title type="subtle" weight="bold" size={isMobile ? 'medium' : 'large'} > <Title type="subtle" weight="bold" size={isMobile ? 'medium' : 'large'} > Lorem ipsum </Title> Lorem ipsum </Title>
      </>
    );
    `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "import { Heading } from '@razorpay/blade/components';
        const App = () => (
          <>
            <Heading size="large"> Lorem ipsum </Heading>  
            <Heading weight="semibold" size="2xlarge" color="surface.text.gray.subtle" > Lorem ipsum </Heading>
            <Heading weight="semibold" size="xlarge" color="surface.text.gray.subtle" > Lorem ipsum </Heading>
            <Heading weight="semibold" size="xlarge" color="surface.text.gray.subtle" > Lorem ipsum </Heading>
            <Heading weight="semibold" size="large" color="surface.text.gray.subtle" > Lorem ipsum </Heading>
            // Conditional expression props should not be changed
            <Heading weight="semibold" size={isMobile ? 'medium' : 'large'} color="surface.text.gray.subtle" > Lorem ipsum </Heading>

            <Heading weight="semibold" size="2xlarge" color="surface.text.gray.subtle" > Lorem ipsum <Heading weight="semibold" size="2xlarge" color="surface.text.gray.subtle" > Lorem ipsum  </Heading>  </Heading>
            <Heading weight="semibold" size="xlarge" color="surface.text.gray.subtle" > Lorem ipsum <Heading weight="semibold" size="xlarge" color="surface.text.gray.subtle" > Lorem ipsum </Heading> </Heading>
            <Heading weight="semibold" size="xlarge" color="surface.text.gray.subtle" > Lorem ipsum <Heading weight="semibold" size="xlarge" color="surface.text.gray.subtle" > Lorem ipsum </Heading> </Heading>
            <Heading weight="semibold" size="large" color="surface.text.gray.subtle" > Lorem ipsum <Heading weight="semibold" size="large" color="surface.text.gray.subtle" > Lorem ipsum </Heading> </Heading>
            // Conditional expression props should not be changed
            <Heading weight="semibold" size={isMobile ? 'medium' : 'large'} color="surface.text.gray.subtle" > <Heading weight="semibold" size={isMobile ? 'medium' : 'large'} color="surface.text.gray.subtle" > Lorem ipsum </Heading> Lorem ipsum </Heading>
          </>
        );"
  `);
});
