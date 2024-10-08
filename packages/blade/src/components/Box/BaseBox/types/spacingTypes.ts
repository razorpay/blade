import type { MakeObjectResponsive } from './responsiveTypes';
import type { DotNotationSpacingStringToken } from '~utils/types';

type ArrayOfMaxLength4<T> = readonly [T?, T?, T?, T?];
type SpaceUnits = 'px' | '%' | 'fr' | 'rem' | 'em' | 'vh' | 'vw';

type SpacingValueType =
  | DotNotationSpacingStringToken
  | `${string}${SpaceUnits}`
  | `calc(${string})`
  | 'auto'
  | `min(${string})`
  | `max(${string})`
  | 'none'
  | 'initial'
  | 'fit-content'
  | 'max-content'
  | 'min-content';

/**
 * @IMPORTANT
 *
 * I wish there was better way to re-use jsdoc but I checked and there isn't so we have to explicitly add docs to each prop.
 *
 * When you want to change a specific token value, you can select the entire block of spacing value mapping and do find and replace on it
 *
 * Checkout example of find and replace query-
 * {@link https://user-images.githubusercontent.com/30949385/221802507-40c7adbc-484a-47b3-9035-ae1e97080b51.png}
 *
 */

type PaddingProps = MakeObjectResponsive<{
  /**
   * ### Padding Shorthand
   *
   * #### Usage
   *
   * ```jsx
   * padding="spacing.3"
   * padding="20px"
   * padding={["spacing.3", "spacing.1", "spacing.0", "10px"]}
   * ```
   *
   * ---
   * #### Spacing to Pixel values
   *
   * - `spacing.0` - 0px
   * - `spacing.1` - 2px
   * - `spacing.2` - 4px
   * - `spacing.3` - 8px
   * - `spacing.4` - 12px
   * - `spacing.5` - 16px
   * - `spacing.6` - 20px
   * - `spacing.7` - 24px
   * - `spacing.8` - 32px
   * - `spacing.9` - 40px
   * - `spacing.10` - 48px
   * - `spacing.11` - 56px
   *
   * {@linkcode https://blade.razorpay.com/?path=/story/tokens-spacing--docs&globals=measureEnabled:false Spacing Token Ref}
   *
   */
  padding: SpacingValueType | ArrayOfMaxLength4<SpacingValueType>;
  /**
   * ### Padding Horizontal
   *
   * #### Usage
   *
   * ```jsx
   * paddingX="spacing.3"
   * paddingX="20px"
   * ```
   *
   * ---
   * #### Spacing to Pixel values
   *
   * - `spacing.0` - 0px
   * - `spacing.1` - 2px
   * - `spacing.2` - 4px
   * - `spacing.3` - 8px
   * - `spacing.4` - 12px
   * - `spacing.5` - 16px
   * - `spacing.6` - 20px
   * - `spacing.7` - 24px
   * - `spacing.8` - 32px
   * - `spacing.9` - 40px
   * - `spacing.10` - 48px
   * - `spacing.11` - 56px
   *
   * {@linkcode https://blade.razorpay.com/?path=/story/tokens-spacing--docs&globals=measureEnabled:false Spacing Token Ref}
   *
   */
  paddingX: SpacingValueType;
  /**
   * ### Padding Vertical
   *
   * #### Usage
   *
   * ```jsx
   * paddingY="spacing.3"
   * paddingY="20px"
   * ```
   *
   * ---
   * #### Spacing to Pixel values
   *
   * - `spacing.0` - 0px
   * - `spacing.1` - 2px
   * - `spacing.2` - 4px
   * - `spacing.3` - 8px
   * - `spacing.4` - 12px
   * - `spacing.5` - 16px
   * - `spacing.6` - 20px
   * - `spacing.7` - 24px
   * - `spacing.8` - 32px
   * - `spacing.9` - 40px
   * - `spacing.10` - 48px
   * - `spacing.11` - 56px
   *
   * {@linkcode https://blade.razorpay.com/?path=/story/tokens-spacing--docs&globals=measureEnabled:false Spacing Token Ref}
   *
   */
  paddingY: SpacingValueType;
  /**
   * ### Padding Top
   *
   * #### Usage
   *
   * ```jsx
   * paddingTop="spacing.3"
   * paddingTop="20px"
   * ```
   *
   * ---
   * #### Spacing to Pixel values
   *
   * - `spacing.0` - 0px
   * - `spacing.1` - 2px
   * - `spacing.2` - 4px
   * - `spacing.3` - 8px
   * - `spacing.4` - 12px
   * - `spacing.5` - 16px
   * - `spacing.6` - 20px
   * - `spacing.7` - 24px
   * - `spacing.8` - 32px
   * - `spacing.9` - 40px
   * - `spacing.10` - 48px
   * - `spacing.11` - 56px
   *
   * {@linkcode https://blade.razorpay.com/?path=/story/tokens-spacing--docs&globals=measureEnabled:false Spacing Token Ref}
   */
  paddingTop: SpacingValueType;
  /**
   * ### Padding Right
   *
   * #### Usage
   *
   * ```jsx
   * paddingRight="spacing.3"
   * paddingRight="20px"
   * ```
   *
   * ---
   * #### Spacing to Pixel values
   *
   * - `spacing.0` - 0px
   * - `spacing.1` - 2px
   * - `spacing.2` - 4px
   * - `spacing.3` - 8px
   * - `spacing.4` - 12px
   * - `spacing.5` - 16px
   * - `spacing.6` - 20px
   * - `spacing.7` - 24px
   * - `spacing.8` - 32px
   * - `spacing.9` - 40px
   * - `spacing.10` - 48px
   * - `spacing.11` - 56px
   *
   * {@linkcode https://blade.razorpay.com/?path=/story/tokens-spacing--docs&globals=measureEnabled:false Spacing Token Ref}
   */
  paddingRight: SpacingValueType;
  /**
   * ### Padding Bottom
   *
   * #### Usage
   *
   * ```jsx
   * paddingBottom="spacing.3"
   * paddingBottom="20px"
   * ```
   *
   * ---
   * #### Spacing to Pixel values
   *
   * - `spacing.0` - 0px
   * - `spacing.1` - 2px
   * - `spacing.2` - 4px
   * - `spacing.3` - 8px
   * - `spacing.4` - 12px
   * - `spacing.5` - 16px
   * - `spacing.6` - 20px
   * - `spacing.7` - 24px
   * - `spacing.8` - 32px
   * - `spacing.9` - 40px
   * - `spacing.10` - 48px
   * - `spacing.11` - 56px
   *
   * {@linkcode https://blade.razorpay.com/?path=/story/tokens-spacing--docs&globals=measureEnabled:false Spacing Token Ref}
   */
  paddingBottom: SpacingValueType;
  /**
   * ### Padding Left
   *
   * #### Usage
   *
   * ```jsx
   * paddingLeft="spacing.3"
   * paddingLeft="20px"
   * ```
   *
   * ---
   * #### Spacing to Pixel values
   *
   * - `spacing.0` - 0px
   * - `spacing.1` - 2px
   * - `spacing.2` - 4px
   * - `spacing.3` - 8px
   * - `spacing.4` - 12px
   * - `spacing.5` - 16px
   * - `spacing.6` - 20px
   * - `spacing.7` - 24px
   * - `spacing.8` - 32px
   * - `spacing.9` - 40px
   * - `spacing.10` - 48px
   * - `spacing.11` - 56px
   *
   * {@linkcode https://blade.razorpay.com/?path=/story/tokens-spacing--docs&globals=measureEnabled:false Spacing Token Ref}
   */
  paddingLeft: SpacingValueType;
}>;

type MarginProps = MakeObjectResponsive<{
  /**
   * ### Margin Shorthand
   *
   * #### Usage
   *
   * ```jsx
   * margin="spacing.3"
   * margin="20px"
   * margin={["spacing.3", "spacing.1", "spacing.0", "10px"]}
   * ```
   *
   * ---
   * #### Spacing to Pixel values
   *
   * - `spacing.0` - 0px
   * - `spacing.1` - 2px
   * - `spacing.2` - 4px
   * - `spacing.3` - 8px
   * - `spacing.4` - 12px
   * - `spacing.5` - 16px
   * - `spacing.6` - 20px
   * - `spacing.7` - 24px
   * - `spacing.8` - 32px
   * - `spacing.9` - 40px
   * - `spacing.10` - 48px
   * - `spacing.11` - 56px
   *
   * {@linkcode https://blade.razorpay.com/?path=/story/tokens-spacing--docs&globals=measureEnabled:false Spacing Token Ref}
   *
   */
  margin: SpacingValueType | ArrayOfMaxLength4<SpacingValueType>;
  /**
   * ### Margin Horizontal
   *
   * #### Usage
   *
   * ```jsx
   * marginX="spacing.3"
   * marginX="20px"
   * ```
   *
   * ---
   * #### Spacing to Pixel values
   *
   * - `spacing.0` - 0px
   * - `spacing.1` - 2px
   * - `spacing.2` - 4px
   * - `spacing.3` - 8px
   * - `spacing.4` - 12px
   * - `spacing.5` - 16px
   * - `spacing.6` - 20px
   * - `spacing.7` - 24px
   * - `spacing.8` - 32px
   * - `spacing.9` - 40px
   * - `spacing.10` - 48px
   * - `spacing.11` - 56px
   *
   * {@linkcode https://blade.razorpay.com/?path=/story/tokens-spacing--docs&globals=measureEnabled:false Spacing Token Ref}
   *
   */
  marginX: SpacingValueType;
  /**
   * ### Margin Vertical
   *
   * #### Usage
   *
   * ```jsx
   * marginY="spacing.3"
   * marginY="20px"
   * ```
   *
   * ---
   * #### Spacing to Pixel values
   *
   * - `spacing.0` - 0px
   * - `spacing.1` - 2px
   * - `spacing.2` - 4px
   * - `spacing.3` - 8px
   * - `spacing.4` - 12px
   * - `spacing.5` - 16px
   * - `spacing.6` - 20px
   * - `spacing.7` - 24px
   * - `spacing.8` - 32px
   * - `spacing.9` - 40px
   * - `spacing.10` - 48px
   * - `spacing.11` - 56px
   *
   * {@linkcode https://blade.razorpay.com/?path=/story/tokens-spacing--docs&globals=measureEnabled:false Spacing Token Ref}
   *
   */
  marginY: SpacingValueType;
  /**
   * ### Margin Top
   *
   * #### Usage
   *
   * ```jsx
   * marginTop="spacing.3"
   * marginTop="20px"
   * ```
   *
   * ---
   * #### Spacing to Pixel values
   *
   * - `spacing.0` - 0px
   * - `spacing.1` - 2px
   * - `spacing.2` - 4px
   * - `spacing.3` - 8px
   * - `spacing.4` - 12px
   * - `spacing.5` - 16px
   * - `spacing.6` - 20px
   * - `spacing.7` - 24px
   * - `spacing.8` - 32px
   * - `spacing.9` - 40px
   * - `spacing.10` - 48px
   * - `spacing.11` - 56px
   *
   * {@linkcode https://blade.razorpay.com/?path=/story/tokens-spacing--docs&globals=measureEnabled:false Spacing Token Ref}
   */
  marginTop: SpacingValueType;
  /**
   * ### Margin Right
   *
   * #### Usage
   *
   * ```jsx
   * marginRight="spacing.3"
   * marginRight="20px"
   * ```
   *
   * ---
   * #### Spacing to Pixel values
   *
   * - `spacing.0` - 0px
   * - `spacing.1` - 2px
   * - `spacing.2` - 4px
   * - `spacing.3` - 8px
   * - `spacing.4` - 12px
   * - `spacing.5` - 16px
   * - `spacing.6` - 20px
   * - `spacing.7` - 24px
   * - `spacing.8` - 32px
   * - `spacing.9` - 40px
   * - `spacing.10` - 48px
   * - `spacing.11` - 56px
   *
   * {@linkcode https://blade.razorpay.com/?path=/story/tokens-spacing--docs&globals=measureEnabled:false Spacing Token Ref}
   */
  marginRight: SpacingValueType;
  /**
   * ### Margin Bottom
   *
   * #### Usage
   *
   * ```jsx
   * marginBottom="spacing.3"
   * marginBottom="20px"
   * ```
   *
   * ---
   * #### Spacing to Pixel values
   *
   * - `spacing.0` - 0px
   * - `spacing.1` - 2px
   * - `spacing.2` - 4px
   * - `spacing.3` - 8px
   * - `spacing.4` - 12px
   * - `spacing.5` - 16px
   * - `spacing.6` - 20px
   * - `spacing.7` - 24px
   * - `spacing.8` - 32px
   * - `spacing.9` - 40px
   * - `spacing.10` - 48px
   * - `spacing.11` - 56px
   *
   * {@linkcode https://blade.razorpay.com/?path=/story/tokens-spacing--docs&globals=measureEnabled:false Spacing Token Ref}
   */
  marginBottom: SpacingValueType;
  /**
   * ### Margin Left
   *
   * #### Usage
   *
   * ```jsx
   * marginLeft="spacing.3"
   * marginLeft="20px"
   * ```
   *
   * ---
   * #### Spacing to Pixel values
   *
   * - `spacing.0` - 0px
   * - `spacing.1` - 2px
   * - `spacing.2` - 4px
   * - `spacing.3` - 8px
   * - `spacing.4` - 12px
   * - `spacing.5` - 16px
   * - `spacing.6` - 20px
   * - `spacing.7` - 24px
   * - `spacing.8` - 32px
   * - `spacing.9` - 40px
   * - `spacing.10` - 48px
   * - `spacing.11` - 56px
   *
   * {@linkcode https://blade.razorpay.com/?path=/story/tokens-spacing--docs&globals=measureEnabled:false Spacing Token Ref}
   */
  marginLeft: SpacingValueType;
}>;

export type { PaddingProps, MarginProps, SpacingValueType, SpaceUnits, ArrayOfMaxLength4 };
