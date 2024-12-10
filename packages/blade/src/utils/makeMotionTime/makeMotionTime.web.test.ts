import { makeMotionTime } from '.';
import { motion } from '~tokens/global';

describe('makeMotionTime', () => {
  it('should return the duration value in `ms`', () => {
    const duration = makeMotionTime(motion.duration.moderate);
    expect(duration).toEqual('280ms');
  });

  it('should return the delay value in `ms`', () => {
    const delay = makeMotionTime(motion.delay.xquick);
    expect(delay).toEqual('160ms');
  });
});
