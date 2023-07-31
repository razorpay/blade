import styled from 'styled-components';
import type { BaseBoxProps } from './types';
import { useMemoizedStyles } from './useMemoizedStyles';
import { omitPropsFromHTML } from '~utils/omitPropsFromHTML';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';

const BaseBox = styled.div
  .attrs<BaseBoxProps>((props) => {
    return {
      ...metaAttribute({
        name: (props as never)['data-blade-component'] || MetaConstants.BaseBox,
        testID: (props as never)['data-testid'] || props.testID,
      }),
    };
  })
  .withConfig({
    shouldForwardProp: omitPropsFromHTML,
    displayName: 'BaseBox',
  })<BaseBoxProps>((props) => {
  const cssObject = useMemoizedStyles(props);
  return cssObject;
});

export { BaseBox };
