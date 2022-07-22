import motion from '../../tokens/global/motion';
import { makeMotionTime } from '.';

describe('makeMotionTime', () => {
  it('should return the duration value in `ms`', () => {
    const duration = makeMotionTime(motion.duration.moderate);
    expect(duration).toEqual('250ms');
  });

  it('should return the delay value in `ms`', () => {
    const delay = makeMotionTime(motion.delay.short);
    expect(delay).toEqual('180ms');
  });
});
