import { incrementTotalUseCountAsync } from '@create-figma-plugin/utilities';

export const sendAnalytics = async ({
  eventName,
  properties,
}: {
  eventName: string;
  properties: object;
}): Promise<void> => {
  const pluginUsageCount = await incrementTotalUseCountAsync();
  await fetch('https://api.segment.io/v1/track', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      Authorization: `Basic ${process.env.SEGMENT_WRITE_KEY}`,
    },
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
