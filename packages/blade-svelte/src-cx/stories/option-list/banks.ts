export interface Bank {
  code: string;
  name: string;
  note?: string;
  isDown?: boolean;
}

export const BANKS: Bank[] = [
  { code: 'hdfc', name: 'HDFC Bank' },
  { code: 'icici', name: 'ICICI Bank', note: 'Low success rate right now' },
  { code: 'sbi', name: 'State Bank of India' },
  { code: 'axis', name: 'Axis Bank' },
  { code: 'yes', name: 'Yes Bank', note: 'Unavailable', isDown: true },
];
