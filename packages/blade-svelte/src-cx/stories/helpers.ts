/** Story-only helpers: fake latency and a card-number mask for the demos. */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

type Value = string | number | null | undefined;

export function digitsOnly(value: Value): string {
  return String(value ?? '').replace(/\D/g, '');
}

export function groupInFours(value: Value): string {
  return digitsOnly(value).replace(/(.{4})(?=.)/g, (group) => `${group} `);
}

/** Maps a failed declarative constraint to demo copy (the app passes `$t`). */
export function describeConstraint(code: string): string {
  if (code === 'required') {
    return 'This field is required';
  }
  if (code === 'email') {
    return 'Enter a valid email address';
  }
  return 'Check this value';
}

export function stamp(): string {
  return new Date().toISOString().slice(11, 23);
}
