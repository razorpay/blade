import { arrow, shift, useFloating, flip } from '@floating-ui/react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

type TooltipProps = {
  content: string;
  children: React.ReactNode;
};

const Tooltip = ({ content, children }: TooltipProps): React.ReactElement => {
  const [isOpen, setIsOpen] = React.useState(false);
  const arrowRef = React.useRef();
  const { refs, floatingStyles } = useFloating({
    middleware: [shift(), arrow({ element: arrowRef })],
    placement: 'top',
  });

  return (
    <View>
      <Pressable
        style={{ backgroundColor: 'red', alignSelf: 'flex-start' }}
        onTouchStart={() => setIsOpen(true)}
        onTouchEnd={() => {
          setIsOpen(false);
        }}
        ref={refs.setReference}
        collapsable={false}
      >
        <Text>Reference</Text>
      </Pressable>
      {isOpen ? (
        <View ref={refs.setFloating} collapsable={false} style={floatingStyles}>
          <View ref={arrowRef} style={{ width: 10, height: 10, backgroundColor: 'green' }} />
          <Text>Floating</Text>
        </View>
      ) : null}
    </View>
  );
};

export { Tooltip, TooltipProps };
