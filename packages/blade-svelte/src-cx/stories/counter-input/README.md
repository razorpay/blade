# CounterInput

`CounterInput` (`components/counter-input/`) is Blade's: a number between
`min` (default 0) and `max`, stepped by its minus and plus buttons or typed.
Props: `label` / `accessibilityLabel`, `value` (bindable), `onChange` (`{ name, value }`), `min`,
`max`, `name` (a Form collects it), `size` (`xsmall` … `large`), `emphasis`
(`subtle`, `intense`), `isLoading`, `isDisabled`, `onFocus`, `onBlur`,
`testID`, `class`. The label is always on top.
