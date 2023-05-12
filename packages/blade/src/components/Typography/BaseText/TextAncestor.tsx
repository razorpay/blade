import { createContext } from 'react';
import type { BaseTextProps } from '~components/Typography/BaseText/types';

type TextAncestorContextProps = {
  /**
   * Flag to determine if the component is a descendant of BaseText
   *
   * @default false
   */
  value: boolean;
  /**
   * BaseText props
   */
  props?: Omit<
    BaseTextProps,
    'id' | 'testID' | 'numberOfLines' | 'truncateAfterLines' | 'children'
  >;
};

const TextAncestorContext = createContext<TextAncestorContextProps>({
  value: false,
});

export default TextAncestorContext;
