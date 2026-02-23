import styled from 'styled-components';
import type { ListViewProps } from './types';
import { ListViewProvider } from './ListViewContext';
import type { ColorSchemeNames } from '~tokens/theme';
import { getSurfaceBoxShadow, getSurfaceStyles } from '~utils/makeSurfaceStyles';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { MetaConstants, metaAttribute } from '~utils/metaAttribute';
import BaseBox from '~components/Box/BaseBox';
import useTheme from '~components/BladeProvider/useTheme';

const ListViewSurface = styled(BaseBox)<{ colorScheme: ColorSchemeNames }>(
  ({ theme, colorScheme }) => {
    const isDarkMode = colorScheme === 'dark';
    const { elevation, top } = getSurfaceBoxShadow(theme, colorScheme);
    const borderColor = theme.colors.interactive.border.gray.disabled;

    return {
      width: '100%',
      display: 'flex',
      position: 'relative',
      flexDirection: 'column',
      boxSizing: 'border-box',
      ...getSurfaceStyles(theme, colorScheme, { beforeGradientZIndex: 0 }),
      boxShadow: `${elevation}, ${top}`,
      borderLeft: `1px solid ${borderColor}`,
      borderRight: `1px solid ${borderColor}`,
      borderBottom: `1px solid ${borderColor}`,
      ...(!isDarkMode && {
        borderTop: `1px solid ${borderColor}`,
      }),
    };
  },
);

const ListView = ({ testID, children, ...rest }: ListViewProps): React.ReactElement => {
  const { colorScheme } = useTheme();
  return (
    <ListViewProvider value={{ isInsideListView: true }}>
      <ListViewSurface
        colorScheme={colorScheme}
        borderRadius="medium"
        overflow="hidden"
        backgroundColor="surface.background.gray.intense"
        {...metaAttribute({ name: MetaConstants.ListView, testID })}
        {...makeAnalyticsAttribute(rest)}
      >
        {children}
      </ListViewSurface>
    </ListViewProvider>
  );
};

export { ListView };
