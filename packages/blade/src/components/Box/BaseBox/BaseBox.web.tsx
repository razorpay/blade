import React from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import styled from 'styled-components';
import type { BaseBoxProps } from './types';
import { useMemoizedStyles } from './useMemoizedStyles';
import { omitPropsFromHTML } from '~utils/omitPropsFromHTML';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import type { BladeCommonEvents } from '~components/types';

const StyledBaseBox = styled.div
  .attrs<BaseBoxProps>((props) => {
    return {
      ...metaAttribute({
        name: (props as never)['data-blade-component'] || MetaConstants.BaseBox,
        testID: (props as never)['data-testid'] || props.testID,
      }),
      ...makeAnalyticsAttribute((props as unknown) as Record<string, unknown>),
    };
  })
  .withConfig({
    shouldForwardProp: omitPropsFromHTML,
    displayName: 'BaseBox',
  })<BaseBoxProps>((props) => {
  const cssObject = useMemoizedStyles(props);
  return cssObject;
});

type PolymorphicBaseBoxProps = Omit<ComponentPropsWithoutRef<'div'>, keyof BladeCommonEvents> &
  BaseBoxProps & {
    as?: string | React.ElementType;
  } & BladeCommonEvents;

const _BaseBox = React.forwardRef<HTMLDivElement, PolymorphicBaseBoxProps>((props, ref) => {
  return <StyledBaseBox {...props} ref={ref} />;
});

const BaseBox = assignWithoutSideEffects(React.memo<typeof _BaseBox>(_BaseBox), {
  componentId: 'BaseBox',
});

export { BaseBox };
