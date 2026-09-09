import type {
  AutoCapitalize,
  AutoCompleteSuggestionType,
  BaseInputType,
  KeyboardReturnKeyType,
  KeyboardType,
} from './types';

/** Types excluding password (leaf inputs never render password). */
export type NonPasswordType = Exclude<BaseInputType, 'password'>;

export type KeyboardAndAutoComplete = {
  type: NonPasswordType;
  keyboardType: KeyboardType;
  keyboardReturnKeyType: KeyboardReturnKeyType;
  autoCompleteSuggestionType: AutoCompleteSuggestionType;
  autoCapitalize?: AutoCapitalize;
};

const keyboardConfigMap = {
  text: {
    keyboardType: 'text',
    keyboardReturnKeyType: 'default',
    autoCompleteSuggestionType: 'none',
    autoCapitalize: undefined,
  },
  telephone: {
    keyboardType: 'telephone',
    keyboardReturnKeyType: 'done',
    autoCompleteSuggestionType: 'telephone',
    autoCapitalize: undefined,
  },
  email: {
    keyboardType: 'email',
    keyboardReturnKeyType: 'done',
    autoCompleteSuggestionType: 'email',
    autoCapitalize: 'none',
  },
  url: {
    keyboardType: 'url',
    keyboardReturnKeyType: 'go',
    autoCompleteSuggestionType: 'none',
    autoCapitalize: 'none',
  },
  number: {
    keyboardType: 'decimal',
    keyboardReturnKeyType: 'done',
    autoCompleteSuggestionType: 'none',
    autoCapitalize: undefined,
  },
  search: {
    keyboardType: 'search',
    keyboardReturnKeyType: 'search',
    autoCompleteSuggestionType: 'none',
    autoCapitalize: undefined,
  },
} as const;

/**
 * Ported from React `Input/BaseInput/utils.ts` (web subset). Resolves the
 * keyboard/autocomplete props for a given input `type`, applying the per-type
 * defaults and overriding `type` to `text` for `number`/`search` (matches
 * React's browser workarounds).
 */
export const getKeyboardAndAutocompleteProps = ({
  type = 'text',
  keyboardReturnKeyType,
  autoCompleteSuggestionType,
  autoCapitalize,
}: {
  type?: NonPasswordType;
  keyboardReturnKeyType?: KeyboardReturnKeyType;
  autoCompleteSuggestionType?: AutoCompleteSuggestionType;
  autoCapitalize?: AutoCapitalize;
}): KeyboardAndAutoComplete => {
  const config = keyboardConfigMap[type];

  const result: KeyboardAndAutoComplete = {
    type,
    keyboardType: config.keyboardType,
    keyboardReturnKeyType: keyboardReturnKeyType ?? config.keyboardReturnKeyType,
    autoCompleteSuggestionType: autoCompleteSuggestionType ?? config.autoCompleteSuggestionType,
    autoCapitalize: autoCapitalize ?? config.autoCapitalize,
  };

  // number: keyboardType:decimal shows number pad reliably across platforms.
  // search: type:search adds a native clear button that collides with ours.
  if (type === 'number' || type === 'search') {
    result.type = 'text';
  }

  return result;
};

const autoCompleteSuggestionTypeMap: Record<AutoCompleteSuggestionType, string> = {
  none: 'off',
  on: 'on',
  name: 'name',
  email: 'email',
  username: 'username',
  password: 'current-password',
  newPassword: 'new-password',
  oneTimeCode: 'one-time-code',
  telephone: 'tel',
  postalCode: 'postal-code',
  countryName: 'country',
  creditCardNumber: 'cc-number',
  creditCardCSC: 'cc-csc',
  creditCardExpiry: 'cc-exp',
  creditCardExpiryMonth: 'cc-exp-month',
  creditCardExpiryYear: 'cc-exp-year',
};

/** Maps a suggestion type to the DOM `autocomplete` attribute value. */
export const getAutoComplete = (
  autoCompleteSuggestionType?: AutoCompleteSuggestionType,
): string | undefined =>
  autoCompleteSuggestionType
    ? autoCompleteSuggestionTypeMap[autoCompleteSuggestionType]
    : undefined;

/** Maps the return-key type to the DOM `enterkeyhint` attribute value. */
export const getEnterKeyHint = (
  keyboardReturnKeyType?: KeyboardReturnKeyType,
): string | undefined => (keyboardReturnKeyType === 'default' ? 'enter' : keyboardReturnKeyType);

/** Maps `keyboardType` to the DOM `inputmode` attribute value. */
export const getInputMode = (keyboardType?: KeyboardType): string | undefined => {
  if (!keyboardType) return undefined;
  return keyboardType === 'telephone' ? 'tel' : keyboardType;
};

/** Maps the input `type` prop to the DOM `type` attribute (telephone → tel). */
export const getDomType = (type?: NonPasswordType): string => {
  if (!type) return 'text';
  return type === 'telephone' ? 'tel' : type;
};

/** Resolves the hint type shown below the input (mirrors React `getHintType`). */
export const getHintType = ({
  validationState,
  hasHelpText: _hasHelpText,
}: {
  validationState?: 'success' | 'error' | 'none';
  hasHelpText: boolean;
}): 'help' | 'error' | 'success' => {
  if (validationState === 'error') return 'error';
  if (validationState === 'success') return 'success';
  return 'help';
};

/** Resolves the id referenced by `aria-describedby` for the active hint. */
export const getDescribedByElementId = ({
  validationState,
  hasErrorText,
  hasSuccessText,
  hasHelpText,
  errorTextId,
  successTextId,
  helpTextId,
}: {
  validationState?: 'success' | 'error' | 'none';
  hasErrorText: boolean;
  hasSuccessText: boolean;
  hasHelpText: boolean;
  errorTextId: string;
  successTextId: string;
  helpTextId: string;
}): string | undefined => {
  if (validationState === 'error' && hasErrorText) return errorTextId;
  if (validationState === 'success' && hasSuccessText) return successTextId;
  if (hasHelpText) return helpTextId;
  return undefined;
};
