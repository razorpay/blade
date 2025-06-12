import os from 'os';
import crypto from 'crypto';
import * as Sentry from '@sentry/node';
import { Analytics } from '@segment/analytics-node';
import { getPackageJSONVersion } from './generalUtils.js';

let cachedMachineId: string | null = null;

const handleError = ({
  toolName,
  errorObject,
  mcpErrorMessage = '',
}: {
  toolName: string;
  errorObject?: unknown;
  mcpErrorMessage?: string;
}): {
  isError: true;
  content: Array<{ type: 'text'; text: string }>;
} => {
  if (errorObject) {
    Sentry.captureException(errorObject);
  }
  return {
    isError: true,
    content: [
      {
        type: 'text',
        text: errorObject
          ? `Error in ${toolName}: ${
              errorObject instanceof Error ? errorObject.message : String(errorObject)
            }`
          : mcpErrorMessage,
      },
    ],
  };
};

/**
 * Get MAC addresses from network interfaces
 */
const getMacAddresses = (): string[] => {
  try {
    const interfaces = os.networkInterfaces();
    const macAddresses: string[] = [];

    // Collect all non-internal MAC addresses
    Object.values(interfaces).forEach((networkInterface) => {
      if (networkInterface) {
        networkInterface.forEach((details) => {
          if (!details.internal && details.mac && details.mac !== '00:00:00:00:00:00') {
            macAddresses.push(details.mac);
          }
        });
      }
    });

    return macAddresses;
  } catch (error: unknown) {
    Sentry.captureException(error);
    return [];
  }
};

/**
 * Create a hash from a string
 */
const createHashFromString = (input: string): string => {
  const hash = crypto.createHash('sha256');
  hash.update(input);
  return hash.digest('hex').substring(0, 12);
};

/**
 * Generates a consistent machine ID based primarily on MAC addresses
 */
export const getUniqueIdentifier = (): string => {
  // Return cached ID if available
  if (cachedMachineId) {
    return cachedMachineId;
  }

  try {
    // Get MAC addresses from network interfaces
    const macAddresses = getMacAddresses();

    // If we have MAC addresses, use them to generate the ID
    if (macAddresses.length > 0) {
      // Create a hash of the MAC addresses
      const hash = crypto.createHash('sha256');
      hash.update(macAddresses.join('-'));

      // Generate deterministic machine ID
      const machineId = `blade-${hash.digest('hex').substring(0, 16)}`;

      cachedMachineId = machineId;
      return machineId;
    }

    // Fallback to hostname if no MAC addresses available
    const fallbackId = `blade-host-${createHashFromString(os.hostname())}`;
    cachedMachineId = fallbackId;
    return fallbackId;
  } catch (error: unknown) {
    Sentry.captureException(error);
    // Ultimate fallback if any errors occur
    const fallbackId = `blade-fallback-${Date.now()}`;
    cachedMachineId = fallbackId;
    return fallbackId;
  }
};

const sendAnalytics = ({
  eventName,
  properties,
}: {
  eventName: string;
  properties: object;
}): void => {
  try {
    const analytics = new Analytics({ writeKey: process.env.BLADE_SEGMENT_KEY ?? '' });
    // Get or create machine ID
    const machineId = getUniqueIdentifier();
    analytics.track({
      userId: machineId,
      event: eventName,
      properties: {
        osType: os.type(),
        nodeVersion: process.version,
        serverVersion: getPackageJSONVersion(),
        ...properties,
      },
    });
  } catch (error: unknown) {
    Sentry.captureException(error);
  }
};

export { handleError, sendAnalytics };
