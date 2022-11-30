import { useTheme } from '~components/BladeProvider';
import Box from '~components/Box';

const Divider = (): React.ReactElement => {
  const { theme } = useTheme();

  return (
    <Box
      border={`${theme.border.width.thin}px solid ${theme.colors.surface.border.normal.lowContrast}`}
    />
  );
};

export { Divider };
