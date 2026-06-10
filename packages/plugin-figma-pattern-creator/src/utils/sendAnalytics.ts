/// <reference types="@figma/plugin-typings" />

/* eslint-disable-next-line import/no-extraneous-dependencies */
import { incrementTotalUseCountAsync } from '@create-figma-plugin/utilities';

export const sendAnalytics = async ({
  eventName,
  properties,
}: {
  eventName: string;
  properties: object;
}): Promise<void> => {
  try {
    const pluginUsageCount = await incrementTotalUseCountAsync();
    
    // Segment.io write key from environment variables
    const SEGMENT_WRITE_KEY = import.meta.env.VITE_SEGMENT_WRITE_KEY;
    
    if (!SEGMENT_WRITE_KEY) {
      console.warn('VITE_SEGMENT_WRITE_KEY environment variable is not set. Analytics will be disabled.');
      return;
    }
    
    // Base64 encode the write key for Basic Auth (write_key:)
    let authHeader = '';
    try {
      // Try to use btoa if available
      authHeader = `Basic ${btoa(SEGMENT_WRITE_KEY + ':')}`;
    } catch (error) {
      // Fallback: manual Base64 encoding if btoa is not available
      const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
      const str = SEGMENT_WRITE_KEY + ':';
      let result = '';
      let i = 0;
      while (i < str.length) {
        const a = str.charCodeAt(i++);
        const b = i < str.length ? str.charCodeAt(i++) : 0;
        const c = i < str.length ? str.charCodeAt(i++) : 0;
        const bitmap = (a << 16) | (b << 8) | c;
        result += base64Chars.charAt((bitmap >> 18) & 63) +
                  base64Chars.charAt((bitmap >> 12) & 63) +
                  (i - 2 < str.length ? base64Chars.charAt((bitmap >> 6) & 63) : '=') +
                  (i - 1 < str.length ? base64Chars.charAt(bitmap & 63) : '=');
      }
      authHeader = `Basic ${result}`;
    }

    const headers: Record<string, string> = {
      'content-type': 'application/json',
      'Authorization': authHeader
    };
    
    // Safely get user information with fallbacks
    let userId = `anonymous-user-${Date.now()}`;
    let userName = 'Anonymous User';
    
    try {
      if (figma.currentUser && figma.currentUser.id) {
        userId = figma.currentUser.id;
        userName = figma.currentUser.name || 'Unknown User';
      }
    } catch (userError) {
      console.warn('Could not access current user information:', userError);
    }
    
    const requestBody = {
      userId,
      event: eventName,
      properties: Object.assign({
        userName,
        fileName: figma.currentPage.parent && figma.currentPage.parent.name,
        pageName: figma.currentPage.name,
        pluginUsageCount,
      }, properties),
    };


    const response = await fetch('https://api.segment.io/v1/track', {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Analytics request failed:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Analytics request failed: ${response.status} ${response.statusText}`);
    }

  } catch (error) {
    // Silently fail analytics to not break the plugin functionality
    console.warn('Analytics failed:', error);
  }
  /**
   * TODO: will use this once we add the UI part of this plugin, till then using the default fetch
   */
  //   const analytics = AnalyticsBrowser.load({ writeKey: SEGMENT_WRITE_KEY });
  //   await analytics.track(eventName, {
  //     userId: figma.currentUser?.id ?? `logged-out-user-${Date.now()}`,
  //     userName: figma.currentUser?.name,
  //     fileName: figma.currentPage.parent?.name,
  //     pageName: figma.currentPage.name,
  //     ...properties,
  //   });
};