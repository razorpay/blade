import { AccessibilityInfo } from 'react-native';
import { announce, clearAnnouncer, destroyAnnouncer } from '../LiveAnnouncer.native';
import { logger } from '~utils/logger';

jest.mock('~utils/logger');

describe('LiveAnnouncer (native)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call AccessibilityInfo.announceForAccessibility', () => {
    const spy = jest.spyOn(AccessibilityInfo, 'announceForAccessibility');
    announce('Test notification');
    expect(spy).toHaveBeenCalledWith('Test notification');
  });

  it('should log warning when clearAnnouncer is called', () => {
    clearAnnouncer('assertive');
    expect(logger).toHaveBeenCalledWith({
      type: 'warn',
      message: 'clearAnnouncer is not needed in react-native',
      moduleName: 'LiveAnnouncer',
    });
  });

  it('should log warning when destroyAnnouncer is called', () => {
    destroyAnnouncer();
    expect(logger).toHaveBeenCalledWith({
      type: 'warn',
      message: 'destroyAnnouncer is not needed in react-native',
      moduleName: 'LiveAnnouncer',
    });
  });
});
