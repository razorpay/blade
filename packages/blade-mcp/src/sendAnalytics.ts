import os from 'os';
import crypto from 'crypto';
import * as Sentry from '@sentry/node';
import { getPackageJSONVersion } from './utils.js';

let cachedMachineId: string | null = null;

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
    console.error('Error getting MAC addresses:', error);
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
    console.error('Error generating machine ID:', error);
    const fallbackId = `blade-fallback-${Date.now()}`;
    cachedMachineId = fallbackId;
    return fallbackId;
  }
};

export const sendAnalytics = async ({
  eventName,
  properties,
}: {
  eventName: string;
  properties: object;
}): Promise<void> => {
  try {
    // Get or create machine ID
    const machineId = getUniqueIdentifier();

    await fetch('https://api.segment.io/v1/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${process.env.BLADE_SEGMENT_KEY}`,
      },
      body: JSON.stringify({
        userId: machineId,
        event: eventName,
        properties: {
          // Use only the properties passed in
          osType: os.type(),
          nodeVersion: process.version,
          serverVersion: getPackageJSONVersion(),
          // add user email
          ...properties,
        },
      }),
    });
  } catch (error: unknown) {
    Sentry.captureException(error);
    console.error('Error sending analytics:', error);
  }
};
