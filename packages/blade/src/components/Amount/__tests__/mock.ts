import type { AmountProps } from '../Amount';

export const AMOUNT_SUFFIX_TEST_SET: {
  value: number;
  suffix: AmountProps['suffix'];
  output: string;
  locale?: string;
}[] = [
  { value: 1000000.22, suffix: 'humanize', output: '1Mio.₹', locale: 'de-DE' },
  { value: 1000000.0, suffix: 'decimals', output: '₹1,000,000.00', locale: 'en-US' },
  { value: 10000000, suffix: 'none', output: '₹10,000,000', locale: 'en-US' },
  { value: 2.07, suffix: 'decimals', output: '2,07₹', locale: 'fr-FR' },
  { value: 2.077, suffix: 'decimals', output: '₹2.08', locale: 'en-IN' },
  { value: 2.3, suffix: 'decimals', output: '₹2.30', locale: 'en-IN' },
  { value: 1000000.12, suffix: 'decimals', output: '₹10,00,000.12', locale: 'en-IN' },
  { value: -1000000.12, suffix: 'decimals', output: '-₹10,00,000.12', locale: 'en-IN' },
  { value: -1000000.12, suffix: 'humanize', output: '-1Mio.₹', locale: 'de-De' },
];
