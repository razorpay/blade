import styled from 'styled-components';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import type { BaseBoxProps } from './types';
import { useMemoizedStyles } from './useMemoizedStyles';
import { omitPropsFromHTML } from '~utils/omitPropsFromHTML';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _BaseBox = styled.div
  .attrs<BaseBoxProps>((props) => {
    return {
      elevation: props.$isCard ? props.elevation : undefined,
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
  })<BaseBoxProps>(({ elevation, $isCard, ...props }) => {
  const cssObject = useMemoizedStyles({ ...props, elevation: $isCard ? undefined : elevation });
  return cssObject;
});

const BaseBox = assignWithoutSideEffects(_BaseBox, { componentId: 'BaseBox' });

export { BaseBox };
