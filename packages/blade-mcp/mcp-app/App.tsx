import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { GenUIProvider, GenUISchemaRenderer } from '@razorpay/blade/components';
import { BladeProvider } from '@razorpay/blade/components';
import { bladeTheme } from '@razorpay/blade/tokens';
import type { GenUIAction, GenUIComponentRegistry } from '@razorpay/blade/components';
import {
  Box,
  Text,
  Accordion,
  AccordionItem,
  AccordionItemHeader,
  AccordionItemBody,
  Tabs,
  TabList,
  TabItem,
  TabPanel,
} from '@razorpay/blade/components';
import type { App as McpAppType, McpUiHostContext } from '@modelcontextprotocol/ext-apps';

type GenUISpec = Array<Record<string, unknown>>;

// Accordion item type from schema
type AccordionItemData = {
  title: string;
  description?: string;
  children: GenUISpec;
};

// Accordion component props from schema
type AccordionComponentProps = {
  component: 'ACCORDION';
  items: AccordionItemData[];
  defaultExpandedIndex?: number;
  variant?: 'filled' | 'transparent';
  showNumberPrefix?: boolean;
  index: number;
};

// Tab item type from schema
type TabItemData = {
  value: string;
  label: string;
  children: GenUISpec;
  isDisabled?: boolean;
};

// Tabs component props from schema
type TabsComponentProps = {
  component: 'TABS';
  items: TabItemData[];
  defaultValue?: string;
  variant?: 'bordered' | 'borderless' | 'filled';
  size?: 'small' | 'medium' | 'large';
  isFullWidthTabItem?: boolean;
  index: number;
};

// Custom Accordion renderer for GenUI
function AccordionRenderer({
  items,
  defaultExpandedIndex,
  variant = 'transparent',
  showNumberPrefix,
}: AccordionComponentProps): React.ReactElement {
  return (
    <Accordion
      marginY="spacing.4"
      defaultExpandedIndex={defaultExpandedIndex}
      variant={variant}
      showNumberPrefix={showNumberPrefix}
    >
      {items.map((item, idx) => (
        <AccordionItem key={idx}>
          <AccordionItemHeader title={item.title} subtitle={item.description} />
          <AccordionItemBody>
            <GenUISchemaRenderer components={item.children} isAnimating={false} />
          </AccordionItemBody>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

// Custom Tabs renderer for GenUI
function TabsRenderer({
  items,
  defaultValue,
  variant = 'bordered',
  size = 'medium',
  isFullWidthTabItem,
}: TabsComponentProps): React.ReactElement {
  const initialValue = defaultValue || items[0]?.value;

  return (
    <Box marginY="spacing.5">
      <Tabs
        defaultValue={initialValue}
        variant={variant}
        size={size}
        isFullWidthTabItem={isFullWidthTabItem}
      >
        <TabList>
          {items.map((item) => (
            <TabItem key={item.value} value={item.value} isDisabled={item.isDisabled}>
              {item.label}
            </TabItem>
          ))}
        </TabList>
        {items.map((item) => (
          <TabPanel key={item.value} value={item.value}>
            <Box paddingTop="spacing.4">
              <GenUISchemaRenderer components={item.children} isAnimating={false} />
            </Box>
          </TabPanel>
        ))}
      </Tabs>
    </Box>
  );
}

// Custom component registry for GenUI
const customComponents: GenUIComponentRegistry = {
  ACCORDION: {
    renderer: AccordionRenderer as React.ComponentType<{ index: number }>,
  },
  TABS: {
    renderer: TabsRenderer as React.ComponentType<{ index: number }>,
  },
};

type ToolResult = {
  content?: Array<{ type: string; text?: string }>;
  structuredContent?: { spec?: GenUISpec };
};

type ToolInput = {
  arguments?: { spec?: GenUISpec };
  structuredContent?: { spec?: GenUISpec };
};

function parseSpec(result: ToolResult | undefined): GenUISpec | null {
  if (result?.structuredContent?.spec) {
    return result.structuredContent.spec;
  }

  const text = result?.content?.find((c) => c.type === 'text')?.text;
  if (!text) return null;

  try {
    const parsed = JSON.parse(text);
    if (parsed.components && Array.isArray(parsed.components)) {
      return parsed as GenUISpec;
    }
    return null;
  } catch {
    return null;
  }
}

function parseSpecFromInput(input: ToolInput | undefined): GenUISpec | null {
  if (input?.structuredContent?.spec) {
    return input.structuredContent.spec;
  }

  if (input?.arguments?.spec) {
    return input.arguments.spec;
  }

  return null;
}

function LoadingState(): React.ReactElement {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="200px"
      paddingY="spacing.4"
    >
      <Text color="surface.text.gray.muted">Waiting for UI spec...</Text>
    </Box>
  );
}

function ErrorState({ message }: { message: string }): React.ReactElement {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="200px"
      paddingY="spacing.4"
      backgroundColor="surface.background.gray.moderate"
    >
      <Text color="feedback.text.negative.intense">{message}</Text>
    </Box>
  );
}

function BladeGenUIApp(): React.ReactElement {
  const [spec, setSpec] = useState<GenUISpec | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');
  const appRef = useRef<McpAppType | null>(null);
  const specReceivedRef = useRef(false);

  const handleActionClick = useCallback(async (action: GenUIAction) => {
    console.log('[BladeGenUI] Action clicked:', action);

    const actionData = action.data as Record<string, unknown> | undefined;
    let message: string | undefined;

    // Check for explicit message first
    if (actionData?.message && typeof actionData.message === 'string') {
      message = actionData.message;
    }
    // Handle link_click - navigate and send "Show {url}" message
    else if (action.eventName === 'link_click' && actionData?.url) {
      const url = actionData.url as string;
      message = `Show ${url}`;
      const result = await appRef.current?.openLink?.({ url });
      if (result?.isError) {
        appRef.current?.sendMessage?.({
          role: 'user',
          content: [{ type: 'text', text: message }],
        });
        return;
      }
      return;
    }
    // Handle TABLE_ROW_ACTION - send "Row action: {eventName} on row {rowIndex}"
    else if (action.type === 'TABLE_ROW_ACTION' && action.eventName) {
      const rowIndex = actionData?.rowIndex;
      const rowData = actionData?.rowData;
      message = `Table row action: "${action.eventName}" on row ${rowIndex ?? 'unknown'}`;
      if (rowData) {
        message += ` with data: ${JSON.stringify(rowData)}`;
      }
    }
    // Handle button/alert actions with eventName
    else if (action.eventName) {
      message = `Action triggered: "${action.eventName}"`;
      if (actionData) {
        message += ` with data: ${JSON.stringify(actionData)}`;
      }
    }
    // Fallback: stringify the entire action data
    else if (actionData) {
      message = JSON.stringify(actionData);
    }

    // Send the message back to the host as a user message/follow-up
    if (message) {
      appRef.current?.sendMessage?.({
        role: 'user',
        content: [{ type: 'text', text: message }],
      });
    }

    // Log the action for debugging
    appRef.current?.sendLog?.({ level: 'info', data: { action } });
  }, []);

  const applyHostContext = useCallback((ctx: McpUiHostContext) => {
    if (ctx.theme) {
      document.documentElement.setAttribute('data-theme', ctx.theme);
      document.documentElement.style.colorScheme = ctx.theme;
      setColorScheme(ctx.theme === 'dark' ? 'dark' : 'light');
    }
    if (ctx.styles?.variables) {
      const root = document.documentElement;
      for (const [key, value] of Object.entries(ctx.styles.variables)) {
        if (value) {
          root.style.setProperty(key, value);
        }
      }
    }
    // if (ctx.safeAreaInsets) {
    //   const { top, right, bottom, left } = ctx.safeAreaInsets;
    //   document.body.style.padding = `${top}px ${right}px ${bottom}px ${left}px`;
    // }
  }, []);

  useEffect(() => {
    let app: McpAppType | null = null;
    let cleanup = false;

    const init = async (): Promise<void> => {
      try {
        const extApps = await import('@modelcontextprotocol/ext-apps');
        const McpApp = extApps.App;
        const PostMessageTransport = extApps.PostMessageTransport;

        if (cleanup) return;

        app = new McpApp({ name: 'Blade GenUI', version: '1.0.0' });
        appRef.current = app;

        app.ontoolinputpartial = (params: unknown) => {
          if (specReceivedRef.current) return;
          setIsStreaming(true);
          const partialSpec = parseSpecFromInput(params as ToolInput);
          if (partialSpec) {
            setSpec(partialSpec);
          }
        };

        app.ontoolinput = (params: unknown) => {
          setIsStreaming(false);
          const inputSpec = parseSpecFromInput(params as ToolInput);
          if (inputSpec) {
            specReceivedRef.current = true;
            setSpec(inputSpec);
          }
        };

        app.ontoolresult = (result: unknown) => {
          setIsStreaming(false);
          const parsed = parseSpec(result as ToolResult);
          if (parsed) {
            specReceivedRef.current = true;
            setSpec(parsed);
          }
        };

        app.onhostcontextchanged = (ctx) => {
          applyHostContext(ctx);
        };

        app.onerror = (err: unknown) => {
          const message = err instanceof Error ? err.message : String(err);
          setError(message);
          console.error('[BladeGenUI] Error:', err);
        };

        app.onteardown = async () => {
          return {};
        };

        // @ts-expect-error - PostMessageTransport is not typed
        await app.connect(new PostMessageTransport());

        const ctx = app.getHostContext?.();
        if (ctx) {
          applyHostContext(ctx);
        } else {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          setColorScheme(prefersDark ? 'dark' : 'light');
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
      }
    };

    init();

    return () => {
      cleanup = true;
      app?.close().catch((err: unknown) => {
        console.error('[BladeGenUI] Error closing app:', err);
      });
    };
  }, [applyHostContext]);

  const genUIConfig = useMemo(
    () => ({
      components: customComponents,
      onActionClick: handleActionClick,
    }),
    [handleActionClick],
  );

  if (error) {
    return (
      <BladeProvider themeTokens={bladeTheme} colorScheme={colorScheme}>
        <ErrorState message={error} />
      </BladeProvider>
    );
  }

  return (
    <BladeProvider key={colorScheme} themeTokens={bladeTheme} colorScheme={colorScheme}>
      <Box
        paddingY="spacing.4"
        width="100%"
        minHeight="100vh"
        backgroundColor="surface.background.gray.moderate"
      >
        {spec ? (
          <GenUIProvider config={genUIConfig}>
            <GenUISchemaRenderer components={spec} isAnimating={isStreaming} />
          </GenUIProvider>
        ) : (
          <LoadingState />
        )}
      </Box>
    </BladeProvider>
  );
}

export { BladeGenUIApp };
