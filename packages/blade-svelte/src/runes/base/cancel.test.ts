import { describe, expect, it } from 'vitest';
import { createCancel } from './cancel';

describe('createCancel', () => {
  it('resolves `cancelled` once cancelled, and later calls do nothing', async () => {
    const request = createCancel();
    let resolved = 0;
    void request.cancelled.then(() => {
      resolved += 1;
    });
    expect(request.isCancelled).toBe(false);
    request.cancel();
    expect(request.isCancelled).toBe(true);
    request.cancel();
    await request.cancelled;
    expect(resolved).toBe(1);
  });

  it('stays pending until cancelled', async () => {
    const request = createCancel();
    const raced = await Promise.race([
      request.cancelled.then(() => 'cancelled'),
      new Promise((resolve) => setTimeout(() => resolve('pending'))),
    ]);
    expect(raced).toBe('pending');
  });
});
