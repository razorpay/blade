import { makeMotionTime } from '.';
import { motion } from '~tokens/global';

describe('makeMotionTime', () => {
  it('should return the duration value in `number`', () => {
    const duration = makeMotionTime(motion.duration.moderate);
    expect(duration).toEqual(250);
  });

  it('should return the delay value in `number`', () => {
    const delay = makeMotionTime(motion.delay.short);
    expect(delay).toEqual(180);
  });
});
