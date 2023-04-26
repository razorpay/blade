import React from 'react';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { BottomSheetBackdrop as GorhomBottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useTheme } from '~components/BladeProvider';

const BottomSheetBackdrop = (
  props: BottomSheetBackdropProps & { zIndex: number },
): React.ReactElement => {
  const { theme } = useTheme();

  return (
    <GorhomBottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      pressBehavior="close"
      opacity={1}
      style={[
        props.style,
        { backgroundColor: theme.colors.overlay.background, zIndex: props.zIndex },
      ]}
    />
  );
};

export { BottomSheetBackdrop };
