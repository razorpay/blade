import { renderHook } from '@testing-library/react-hooks';
import useIconProps from './useIconProps';
import themeWrapper from '~utils/testing/themeWrapper';

describe('useIconProps', () => {
  it('should return a xsmall icon with the correct color', () => {
    const { result } = renderHook(
      () => useIconProps({ size: 'xsmall', color: 'action.icon.secondary.default' }),
      { wrapper: themeWrapper },
    );
    expect(result.current.height).toEqual('8px');
    expect(result.current.width).toEqual('8px');
    expect(result.current.iconColor).toEqual('hsla(213, 89%, 56%, 1)');
  });

  it('should return a small icon with the correct color', () => {
    const { result } = renderHook(
      () => useIconProps({ size: 'small', color: 'feedback.icon.negative.lowContrast' }),
      { wrapper: themeWrapper },
    );
    expect(result.current.height).toEqual('12px');
    expect(result.current.width).toEqual('12px');
    expect(result.current.iconColor).toEqual('hsla(8, 73%, 47%, 1)');
  });

  it('should return a medium icon with the correct color', () => {
    const { result } = renderHook(
      () => useIconProps({ size: 'medium', color: 'action.icon.primary.default' }),
      { wrapper: themeWrapper },
    );
    expect(result.current.height).toEqual('16px');
    expect(result.current.width).toEqual('16px');
    expect(result.current.iconColor).toEqual('hsla(0, 0%, 100%, 1)');
  });

  it('should return a large icon with the correct color', () => {
    const { result } = renderHook(
      () => useIconProps({ size: 'large', color: 'feedback.icon.information.lowContrast' }),
      { wrapper: themeWrapper },
    );
    expect(result.current.height).toEqual('20px');
    expect(result.current.width).toEqual('20px');
    expect(result.current.iconColor).toEqual('hsla(193, 100%, 35%, 1)');
  });

  it('should return a xlarge icon with the correct color', () => {
    const { result } = renderHook(
      () => useIconProps({ size: 'xlarge', color: 'feedback.icon.neutral.lowContrast' }),
      { wrapper: themeWrapper },
    );
    expect(result.current.height).toEqual('24px');
    expect(result.current.width).toEqual('24px');
    expect(result.current.iconColor).toEqual('hsla(216, 27%, 36%, 1)');
  });

  it('should return a 2xlarge icon with the correct color', () => {
    const { result } = renderHook(
      () => useIconProps({ size: '2xlarge', color: 'feedback.icon.neutral.lowContrast' }),
      { wrapper: themeWrapper },
    );
    expect(result.current.height).toEqual('32px');
    expect(result.current.width).toEqual('32px');
    expect(result.current.iconColor).toEqual('hsla(216, 27%, 36%, 1)');
  });

  it('should set fill property to currentColor when color is set to currentColor', () => {
    const { result } = renderHook(() => useIconProps({ size: 'medium', color: 'currentColor' }), {
      wrapper: themeWrapper,
    });
    expect(result.current.iconColor).toEqual('currentColor');
  });
});
