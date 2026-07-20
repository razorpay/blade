/** `value` = single-span amount; `integer` / `decimal` = split decimals path (decimal includes fraction). */
export type AmountSlot =
  | 'root'
  | 'content'
  | 'currency'
  | 'value'
  | 'integer'
  | 'decimal'
  | 'minusSign'
  | 'strikethrough';
