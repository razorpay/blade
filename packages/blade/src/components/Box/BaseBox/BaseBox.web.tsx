import styled from 'styled-components';
import type { BaseBoxProps } from './types';
import { useMemoizedStyles } from './useMemoizedStyles';
import { metaAttribute, MetaConstants, omitPropsFromHTML } from '~utils';

const BaseBox = styled.div
  .attrs<BaseBoxProps>(() => {
    return {
      ...metaAttribute({ name: MetaConstants.BaseBox }),
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
