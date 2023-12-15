import { applyTransform } from '@hypermod/utils';
import * as transformer from '..';

it('should update the lineHeight & fontSize tokens', async () => {
  const result = await applyTransform(
    transformer,
    `
        const CustomBox = styled(Box)\`
            color: \${theme.colors.feedback.notice.action.background.primary.default.lowContrast};
            backgroundColor: \${getIn(theme.colors, 'surface.background.level3.lowContrast')};
        \`  
        const App = () => (
            <>
              <CustomBox> Lorem ipsum </CustomBox>  
              <Text color="feedback.text.information.lowContrast"> Lorem ipsum </Text>
            </>
          );
        `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "const CustomBox = styled(Box)\`
                color: \${theme.colors.interactive.background.notice.faded};
                backgroundColor: \${getIn(theme.colors, 'surface.background.gray.moderate')};
            \`  
            const App = () => (
                <>
                  <CustomBox> Lorem ipsum </CustomBox>  
                  <Text color="feedback.text.information.intense"> Lorem ipsum </Text>
                </>
              );"
  `);
});

it('should update the theme in BladeProvider', async () => {
  const result = await applyTransform(
    transformer,
    `
    import { BladeProvider } from '@razorpay/blade/components';
    import { bankingTheme } from '@razorpay/blade/tokens';

    const AppWrapper = () => {
      return (
        <BladeProvider themeTokens={bankingTheme} colorScheme="light">
          <App />
        </BladeProvider>
      );
    }

    export default AppWrapper;
    `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "import { BladeProvider } from '@razorpay/blade/components';
        import { bladeTheme } from '@razorpay/blade/tokens';

        const AppWrapper = () => {
          return (
            <BladeProvider themeTokens={bladeTheme} colorScheme="light">
              <App />
            </BladeProvider>
          );
        }

        export default AppWrapper;"
  `);
});

it('should update the theme in BladeProvider', async () => {
  const result = await applyTransform(
    transformer,
    `
    import { BladeProvider } from '@razorpay/blade/components';
    import { paymentTheme } from '@razorpay/blade/tokens';

    const AppWrapper = () => {
      return (
        <BladeProvider themeTokens={paymentTheme} colorScheme="light">
          <App />
        </BladeProvider>
      );
    }

    export default AppWrapper;
    `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "import { BladeProvider } from '@razorpay/blade/components';
        import { bladeTheme } from '@razorpay/blade/tokens';

        const AppWrapper = () => {
          return (
            <BladeProvider themeTokens={bladeTheme} colorScheme="light">
              <App />
            </BladeProvider>
          );
        }

        export default AppWrapper;"
  `);
});
