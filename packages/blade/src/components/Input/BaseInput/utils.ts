import type { BaseInputProps } from './BaseInput';

type Type = Exclude<BaseInputProps['type'], 'password'>;

type TextInputKeyboardAndAutoComplete = Pick<
  BaseInputProps,
  'keyboardType' | 'keyboardReturnKeyType' | 'autoCompleteSuggestionType' | 'autoCapitalize'
> & {
  type: Type;
};

const getKeyboardAndAutocompleteProps = ({
  type = 'text',
  keyboardReturnKeyType,
  autoCompleteSuggestionType,
  autoCapitalize,
}: TextInputKeyboardAndAutoComplete): TextInputKeyboardAndAutoComplete => {
  const keyboardAndAutocompleteProps: TextInputKeyboardAndAutoComplete = {
    type,
    keyboardType: 'text',
    keyboardReturnKeyType: 'default',
    autoCompleteSuggestionType: 'none',
    autoCapitalize,
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

  const keyboardConfig = keyboardConfigMap[type];

  keyboardAndAutocompleteProps.keyboardType = keyboardConfig.keyboardType;

  keyboardAndAutocompleteProps.keyboardReturnKeyType =
    keyboardReturnKeyType ?? keyboardConfig.keyboardReturnKeyType;

  keyboardAndAutocompleteProps.autoCompleteSuggestionType =
    autoCompleteSuggestionType ?? keyboardConfig.autoCompleteSuggestionType;

  keyboardAndAutocompleteProps.autoCapitalize = keyboardConfig.autoCapitalize;

  if (type === 'number') {
    /* the default keyboardType:numeric shows alphanumeric keyboard on iOS but number pad on android. making it type:text and keyboardType:decimal fixes this on all platforms.
     * source: https://css-tricks.com/everything-you-ever-wanted-to-know-about-keyboardType/#aa-decimal
     */
    keyboardAndAutocompleteProps.type = 'text';
  }

  if (type === 'search') {
    /* when input type:search is provided at that time browser adds a weird close button which collides with our clear button and then we have 2 clear buttons
     * source: https://github.com/razorpay/blade/issues/857#issue-1457367160
     */
    keyboardAndAutocompleteProps.type = 'text';
  }

  return keyboardAndAutocompleteProps;
};

export { getKeyboardAndAutocompleteProps };
