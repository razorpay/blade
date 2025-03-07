import { applyTransform } from '@hypermod/utils';
import transformer from '..';

it('should update token for dashboard sidebar example', async () => {
  const result = await applyTransform(
    transformer,
    `
    export const SidebarContainer = styled.div<SidebarContainerProps>(
      ({ theme, isRTUXHomepage, isVisible, isMobile }) => \`
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0;
      bottom: 0;
      background-color: \${
        isRTUXHomepage
          ? isMobile
            ? theme.colors.surface.background.cloud.subtle
            : 'transparent'
          : '#2e3345'
      };
      transform: translate(-100%,0);
      transition: transform \${makeMotionTime(theme.motion.delay.short)} \${
        theme.motion.easing.standard.effective
      };
    \`);     
        `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "export const SidebarContainer = styled.div<SidebarContainerProps>(
          ({ theme, isRTUXHomepage, isVisible, isMobile }) => \`
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          bottom: 0;
          background-color: \${
            isRTUXHomepage
              ? isMobile
                ? theme.colors.surface.background.cloud.subtle
                : 'transparent'
              : '#2e3345'
          };
          transform: translate(-100%,0);
          transition: transform \${makeMotionTime(theme.motion.delay.short)} \${
            theme.motion.easing.standard
          };
        \`);"
  `);
});

it('should update token when used as prop', async () => {
  const result = await applyTransform(
    transformer,
    `
      function App() {
        const { theme } = useTheme();

        return <Box easing={theme.motion.easing.standard.wary} />
      }     
        `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "function App() {
            const { theme } = useTheme();

            return <Box easing={theme.motion.easing.shake} />
          }"
  `);
});

it('should update token as used in X payroll', async () => {
  const result = await applyTransform(
    transformer,
    `
    export const AnimatedContainer = styled.div<{ delay?: number }>(({ theme, delay = 0 }) => {
      return css\`
        animation: \${entry} \${makeMotionTime(theme.motion.duration['2xgentle'])}
          \${theme.motion.easing.entrance.revealing} forwards;
        animation-delay: \${delay}ms;
        opacity: 0;
      \`;
    });
        `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "export const AnimatedContainer = styled.div<{ delay?: number }>(({ theme, delay = 0 }) => {
          return css\`
            animation: \${entry} \${makeMotionTime(theme.motion.duration['2xgentle'])}
              \${theme.motion.easing.entrance} forwards;
            animation-delay: \${delay}ms;
            opacity: 0;
          \`;
        });"
  `);
});

it('should update token when variable name is not "theme"', async () => {
  const result = await applyTransform(
    transformer,
    `
    export const AnimatedContainer = styled.div<{ delay?: number }>(({ theme, delay = 0 }) => {
      return css\`
        animation: \${entry} \${makeMotionTime(paymentTheme.motion.duration['2xgentle'])}
          \${paymentTheme.motion.easing.exit.effective} forwards;
        animation-delay: \${delay}ms;
        opacity: 0;
      \`;
    });
        `,
    { parser: 'tsx' },
  );

  expect(result).toMatchInlineSnapshot(`
    "export const AnimatedContainer = styled.div<{ delay?: number }>(({ theme, delay = 0 }) => {
          return css\`
            animation: \${entry} \${makeMotionTime(paymentTheme.motion.duration['2xgentle'])}
              \${paymentTheme.motion.easing.exit} forwards;
            animation-delay: \${delay}ms;
            opacity: 0;
          \`;
        });"
  `);
});
