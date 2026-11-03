import { incrementTotalUseCountAsync } from '@create-figma-plugin/utilities';

// Only these caller-supplied property keys are forwarded to analytics, preventing
// callers from inadvertently (or maliciously) leaking arbitrary/sensitive data.
const ALLOWED_PROPERTY_KEYS = ['checkedItems', 'checkedItemName', 'unCheckedItemName'];

const sanitizeProperties = (properties: Record<string, unknown> = {}): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(properties).filter(([key]) => ALLOWED_PROPERTY_KEYS.includes(key)),
  );

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
      // Anonymous identifier only; avoid sending real user name, file name, or
      // page/document path, which can expose sensitive project/user information.
      userId: figma.currentUser?.id ?? `logged-out-user-${Date.now()}`,
      event: eventName,
      properties: {
        pluginUsageCount,
        ...sanitizeProperties(properties as Record<string, unknown>),
      },
    }),
  });
};
