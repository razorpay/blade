/* eslint-disable-next-line import/no-extraneous-dependencies */
import { incrementTotalUseCountAsync } from '@create-figma-plugin/utilities';

export const sendAnalytics = async ({
  eventName,
  properties,
}: {
  eventName: string;
  properties: object;
}): Promise<void> => {
  const pluginUsageCount = await incrementTotalUseCountAsync();
  const headers: Record<string, string> = {
    'content-type': 'application/json',
  };
  if (process.env.SEGMENT_AUTH) {
    headers.Authorization = process.env.SEGMENT_AUTH;
  }
  await fetch('https://api.segment.io/v1/track', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      userId: figma.currentUser?.id ?? `logged-out-user-${Date.now()}`,
      event: eventName,
      properties: {
        userName: figma.currentUser?.name,
        fileName: figma.currentPage.parent?.name,
        pageName: figma.currentPage.name,
        pluginUsageCount,
        ...properties,
      },
    }),
  });
  // console.log('Analytics sent!!!');
  /**
   * TODO: will use this once we add the UI part of this plugin, till then using the default fetch
   */
  //   const analytics = AnalyticsBrowser.load({ writeKey: '6lpfX5loXnTbBFVo2FbJHpjins0hGaC4' });
  //   await analytics.track(eventName, {
  //     userId: figma.currentUser?.id ?? `logged-out-user-${Date.now()}`,
  //     userName: figma.currentUser?.name,
  //     fileName: figma.currentPage.parent?.name,
  //     pageName: figma.currentPage.name,
  //     ...properties,
  //   });
};
