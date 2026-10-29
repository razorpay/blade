import { describe, it, expect, vi } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { createServer } from '../createServer.js';
import { MCP_DEPRECATION_NUDGE } from '../utils/tokens.js';

vi.mock('../utils/analyticsUtils.js', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  sendAnalytics: vi.fn(),
}));

describe('createServer deprecation nudge', () => {
  it.each(['stdio', 'http'] as const)('every %s tool returns the nudge', async (transportType) => {
    const server = createServer({ transportType });
    const client = new Client({ name: 'test', version: '0.0.0' });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);

    const { tools } = await client.listTools();
    expect(tools.length).toBeGreaterThan(0);

    for (const tool of tools) {
      // eslint-disable-next-line no-await-in-loop
      const result = await client.callTool({ name: tool.name, arguments: {} });
      expect(result.isError).toBe(true);
      expect(result.content).toEqual([{ type: 'text', text: MCP_DEPRECATION_NUDGE }]);
    }
  });
});
