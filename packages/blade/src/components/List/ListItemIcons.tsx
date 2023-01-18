import React from 'react';
// import { Rect } from 'react-native-svg';
import { useTheme } from '../BladeProvider';
import { Svg, Circle, Rect } from '~components/Icons/_Svg';

const UnorderedLevel1Icon = (): React.ReactElement => {
  const { theme } = useTheme();
  return (
    <Svg width="6px" height="6px" viewBox="0 0 6 6" fill="none">
      <Circle cx="3px" cy="3px" r="3px" fill={theme.colors.surface.text.placeholder.lowContrast} />
    </Svg>
  );
};

const UnorderedLevel2Icon = (): React.ReactElement => {
  const { theme } = useTheme();
  return (
    <Svg width="6px" height="6px" viewBox="0 0 6 6" fill="none">
      <Circle
        cx="3px"
        cy="3px"
        r="2.5px"
        stroke={theme.colors.surface.text.placeholder.lowContrast}
      />
    </Svg>
  );
};

const UnorderedLevel3Icon = (): React.ReactElement => {
  const { theme } = useTheme();
  return (
    <Svg width="6px" height="6px" viewBox="0 0 6 6" fill="none">
      <Rect
        width="6px"
        height="6px"
        rx="1px"
        fill={theme.colors.surface.text.placeholder.lowContrast}
      />
    </Svg>
  );
};

const UnorderedItemIcon = ({ level }: { level?: number }): React.ReactElement => {
  switch (level) {
    case 1:
      return <UnorderedLevel1Icon />;
    case 2:
      return <UnorderedLevel2Icon />;
    case 3:
      return <UnorderedLevel3Icon />;
    default:
      return <UnorderedLevel3Icon />;
  }
};

export { UnorderedItemIcon };
