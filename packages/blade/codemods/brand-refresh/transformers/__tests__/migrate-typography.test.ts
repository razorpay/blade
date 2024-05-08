import path from 'path';
import { applyTransform } from '@hypermod/utils';
import * as transformer from '..';
import { red } from '../utils';

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
        import { Heading } from '@razorpay/blade/components';

        const App = () => (
          <>
            <Heading type="subtle" weight="bold" variant="subheading" marginTop="spacing.2"> Lorem ipsum </Heading>  
          </>
        );
      `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "import { Heading, Text } from '@razorpay/blade/components';

            const App = () => (
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
                <CardHeaderText type="subtle" weight="bold"> Lorem ipsum </CardHeaderText>
                <Heading type="subtle" weight="bold"> Lorem ipsum </Heading>
                <Title type="subtle" weight="bold"> Lorem ipsum </Title>
                <Display type="subtle" weight="bold"> Lorem ipsum </Display>
                // weight="bold" should not be changed
                <Code weight="bold"> Lorem ipsum </Code>

                <Text type="subtle" weight="bold" color="brand.primary.500"> Lorem ipsum </Text>
            </>
          );
        `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "const App = () => (
                <>
                    <Text weight="semibold" color="surface.text.gray.subtle"> Lorem ipsum </Text>
                    <CardHeaderText weight="semibold" color="surface.text.gray.subtle"> Lorem ipsum </CardHeaderText>
                    <Text weight="semibold" size="large" color="surface.text.gray.subtle"> Lorem ipsum </Text>
                    <Heading weight="semibold" size="large" color="surface.text.gray.subtle"> Lorem ipsum </Heading>
                    <Display weight="semibold" color="surface.text.gray.subtle"> Lorem ipsum </Display>
                    // weight="bold" should not be changed
                    <Code weight="bold"> Lorem ipsum </Code>

                    <Text weight="semibold" color="surface.text.primary.normal"> Lorem ipsum </Text>
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

it('should update <Text variant="caption" size="medium"> to <Text variant="caption" size="small">', async () => {
  const result = await applyTransform(
    transformer,
    `
        const App = () => (
          <>
            // size="medium" should not be changed if variant is not "caption"
            <Text size="medium">  Lorem ipsum </Text>
            <Text variant="caption">  Lorem ipsum </Text>
            <Text variant="caption" size="medium"> Lorem ipsum </Text>
            <Text variant="caption" size="medium"> Lorem ipsum <Text variant="caption" size="medium" color="brand.primary.500"> Lorem ipsum </Text> </Text>

            <CardHeaderText size="medium">  Lorem ipsum </CardHeaderText>
            <CardHeaderText variant="caption">  Lorem ipsum </CardHeaderText>
            <CardHeaderText variant="caption" size="medium"> Lorem ipsum </CardHeaderText>
          </>
        );
      `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "const App = () => (
              <>
                // size="medium" should not be changed if variant is not "caption"
                <Text size="medium">  Lorem ipsum </Text>
                <Text variant="caption">  Lorem ipsum </Text>
                <Text variant="caption" size="small"> Lorem ipsum </Text>
                <Text variant="caption" size="small"> Lorem ipsum <Text variant="caption" size="small" color="surface.text.primary.normal"> Lorem ipsum </Text> </Text>

                <CardHeaderText size="medium">  Lorem ipsum </CardHeaderText>
                <CardHeaderText variant="caption">  Lorem ipsum </CardHeaderText>
                <CardHeaderText variant="caption" size="small"> Lorem ipsum </CardHeaderText>
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
  const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
  const result = await applyTransform(
    transformer,
    {
      path: path.resolve(__dirname, __filename),
      source: `
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
    },
    { parser: 'tsx' },
  );

  expect(consoleSpy).toHaveBeenCalledTimes(3);

  expect(consoleSpy).toHaveBeenNthCalledWith(
    1,
    red('\n⛔️ Expression found in the "size" attribute, please update manually:'),
    red(`${path.resolve(__dirname, __filename)}:11:10\n`),
  );
  expect(consoleSpy).toHaveBeenNthCalledWith(
    2,
    red('\n⛔️ Expression found in the "size" attribute, please update manually:'),
    red(`${path.resolve(__dirname, __filename)}:18:10\n`),
  );
  expect(consoleSpy).toHaveBeenNthCalledWith(
    3,
    red('\n⛔️ Expression found in the "size" attribute, please update manually:'),
    red(`${path.resolve(__dirname, __filename)}:18:84\n`),
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

  consoleSpy.mockRestore();
});

it('should migrate contrast prop', async () => {
  const result = await applyTransform(
    transformer,
    `
        const App = () => (
          <>
            <Text contrast="high"> Lorem ipsum </Text>
            <Text contrast="low"> Lorem ipsum </Text>

            <Text color="feedback.text.information.lowContrast"> Lorem ipsum </Text>
            <Text color="brand.gray.200.lowContrast"> Lorem ipsum </Text>
            <Text color="brand.gray.200.highContrast"> Lorem ipsum </Text>

            <Text color="brand.gray.200.lowContrast" contrast="high"> Lorem ipsum </Text>
            <Text color="brand.gray.200.highContrast" contrast="low"> Lorem ipsum </Text>

            <CardHeaderText color="brand.gray.200.highContrast" contrast="low"> Lorem ipsum </CardHeaderText>
            <CardHeaderText color="brand.gray.200.lowContrast" contrast="high"> Lorem ipsum </CardHeaderText>

            <CardHeaderText contrast="high"> Lorem ipsum </CardHeaderText>
            <CardHeaderText contrast="low"> Lorem ipsum </CardHeaderText>

            <CardHeaderText color="feedback.text.information.lowContrast"> Lorem ipsum </CardHeaderText>
            <CardHeaderText color="brand.gray.200.lowContrast"> Lorem ipsum </CardHeaderText>
            <CardHeaderText color="brand.gray.200.highContrast"> Lorem ipsum </CardHeaderText>

            <CardHeaderText color="brand.gray.200.lowContrast" contrast="high"> Lorem ipsum </CardHeaderText>
            <CardHeaderText color="brand.gray.200.highContrast" contrast="low"> Lorem ipsum </CardHeaderText>

            <CardHeaderText color="brand.gray.200.highContrast" contrast="low"> Lorem ipsum </CardHeaderText>
            <CardHeaderText color="brand.gray.200.lowContrast" contrast="high"> Lorem ipsum </CardHeaderText>
          </>
        );
      `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "const App = () => (
              <>
                <Text
                  contrast="UPDATE_THIS_VALUE_WITH_A_NEW_COLOR_TOKEN"
                  color="surface.text.gray.normal"> Lorem ipsum </Text>
                <Text color="surface.text.gray.normal"> Lorem ipsum </Text>

                <Text color="feedback.text.information.intense"> Lorem ipsum </Text>
                <Text color="surface.text.gray.moderate"> Lorem ipsum </Text>
                <Text color="UPDATE_THIS_VALUE_WITH_A_NEW_COLOR_TOKEN"> Lorem ipsum </Text>

                <Text color="surface.text.gray.moderate"> Lorem ipsum </Text>
                <Text color="UPDATE_THIS_VALUE_WITH_A_NEW_COLOR_TOKEN"> Lorem ipsum </Text>

                <CardHeaderText color="UPDATE_THIS_VALUE_WITH_A_NEW_COLOR_TOKEN"> Lorem ipsum </CardHeaderText>
                <CardHeaderText color="surface.text.gray.moderate"> Lorem ipsum </CardHeaderText>

                <CardHeaderText
                  contrast="UPDATE_THIS_VALUE_WITH_A_NEW_COLOR_TOKEN"
                  color="surface.text.gray.normal"> Lorem ipsum </CardHeaderText>
                <CardHeaderText color="surface.text.gray.normal"> Lorem ipsum </CardHeaderText>

                <CardHeaderText color="feedback.text.information.intense"> Lorem ipsum </CardHeaderText>
                <CardHeaderText color="surface.text.gray.moderate"> Lorem ipsum </CardHeaderText>
                <CardHeaderText color="UPDATE_THIS_VALUE_WITH_A_NEW_COLOR_TOKEN"> Lorem ipsum </CardHeaderText>

                <CardHeaderText color="surface.text.gray.moderate"> Lorem ipsum </CardHeaderText>
                <CardHeaderText color="UPDATE_THIS_VALUE_WITH_A_NEW_COLOR_TOKEN"> Lorem ipsum </CardHeaderText>

                <CardHeaderText color="UPDATE_THIS_VALUE_WITH_A_NEW_COLOR_TOKEN"> Lorem ipsum </CardHeaderText>
                <CardHeaderText color="surface.text.gray.moderate"> Lorem ipsum </CardHeaderText>
              </>
            );"
  `);
});
