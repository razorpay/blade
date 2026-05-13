import React from 'react';
import type { LightBoxBodyProps, LightBoxItemProps } from './types';
import { useLightBoxContext } from './LightBoxContext';
import { LightBoxItem } from './LightBoxItem';
import { LightBoxMainView } from './LightBoxMainView.web';
import { LightBoxThumbnailStrip } from './LightBoxThumbnailStrip.web';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { Box } from '~components/Box';

const _LightBoxBody = ({ children }: LightBoxBodyProps): React.ReactElement => {
  const { activeIndex, handleIndexChange } = useLightBoxContext();

  const items: LightBoxItemProps[] = [];
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === LightBoxItem) {
      const { src, thumbnail, alt, children: itemChildren } = child.props as LightBoxItemProps & {
        children?: React.ReactNode;
      };
      if (src) {
        items.push({
          src,
          thumbnail: thumbnail ?? src,
          alt,
        });
      } else if (thumbnail && itemChildren != null) {
        items.push({
          thumbnail,
          alt,
          children: itemChildren,
        });
      }
    }
  });

  return (
    <Box
      display="flex"
      flexDirection="column"
      overflow="hidden"
      justifyContent="space-between"
      width="100%"
      height="100%"
    >
      <LightBoxMainView items={items} activeIndex={activeIndex} onChange={handleIndexChange} />
      <LightBoxThumbnailStrip
        items={items}
        activeIndex={activeIndex}
        onSelect={handleIndexChange}
      />
    </Box>
  );
};

const LightBoxBody = assignWithoutSideEffects(_LightBoxBody, {
  displayName: 'LightBoxBody',
});

export { LightBoxBody };
