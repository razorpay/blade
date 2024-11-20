import { incrementTotalUseCountAsync } from '@create-figma-plugin/utilities';

export const sendAnalytics = async ({
  eventName,
  properties,
}: {
  eventName: string;
  properties?: object;
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
        fileName: figma.root.name,
        pageName: figma.currentPage.name,
        pagePath: `${figma.root.name}/${figma.currentPage.name}`,
        pluginUsageCount,
        ...properties,
      },
    }),
  });
};
