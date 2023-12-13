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
